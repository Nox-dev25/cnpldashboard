"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/app/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";

export default function Profile() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Profile updated successfully");
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        router.push("/dashboard");
    };

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/user");

                if (!res.ok) {
                    throw new Error("Unauthorized");
                }

                const data = await res.json();
                setFormData(data);
            } catch (err) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (!loading) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Profile</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <Card className="border-border bg-card max-w-2xl">
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-muted-foreground">
                                        First Name
                                    </Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, firstName: e.target.value })
                                        }
                                        disabled
                                        className="bg-muted/50 border-border text-muted-foreground cursor-not-allowed"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-muted-foreground">
                                        Last Name
                                    </Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, lastName: e.target.value })
                                        }
                                        disabled
                                        className="bg-muted/50 border-border text-muted-foreground cursor-not-allowed"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-muted-foreground">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="bg-muted/50 border-border text-muted-foreground cursor-not-allowed"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        Save Changes
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleCancel}
                                        className="text-primary hover:text-primary/80"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        );
    }
}