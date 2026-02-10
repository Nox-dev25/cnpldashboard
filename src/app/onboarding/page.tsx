import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import KYCValidation from "./components/KYCValidation";

type Props = {
    searchParams: Promise<{
        id?: string;
    }>;
};

export default async function OnboardingPage({ searchParams }: Props) {
    const params = await searchParams;
    const id = params?.id;

    // no onboarding id redirect
    if (!id) redirect("/dashboard");

    const cookieStore = await cookies();
    const sessionId = cookieStore.get("session_id")?.value;

    // no session redirect
    if (!sessionId) redirect("/dashboard");

    const session = await db.session.findUnique({
        where: { id: sessionId },
        include: { user: true },
    });

    // invalid session redirect
    if (!session) redirect("/dashboard");

    const onboarding = await db.onboarding.findFirst({
        where: {
            uuid: id,
            userId: session.user.id,
        },
    });

    // onboarding not found redirect
    if (!onboarding || onboarding.status === "completed") {
        redirect("/dashboard");
    }

    return <KYCValidation />;
}