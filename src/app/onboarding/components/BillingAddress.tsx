"use client";

import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";

export type BillingAddressType = "home" | "office";

interface BillingAddressProps {
    addressType: BillingAddressType;
    streetAddress: string;
    streetAddress2: string;
    state: string;
    city: string;
    postalCode: string;
    onAddressTypeChange: (type: BillingAddressType) => void;
    onStreetAddressChange: (value: string) => void;
    onStreetAddress2Change: (value: string) => void;
    onStateChange: (value: string) => void;
    onCityChange: (value: string) => void;
    onPostalCodeChange: (value: string) => void;
}

export const BillingAddress = ({
    addressType,
    streetAddress,
    streetAddress2,
    state,
    city,
    postalCode,
    onAddressTypeChange,
    onStreetAddressChange,
    onStreetAddress2Change,
    onStateChange,
    onCityChange,
    onPostalCodeChange,
}: BillingAddressProps) => {
    return (
        <div className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-medium text-muted-foreground">Billing Address</h3>

            {/* Address Type Selection */}
            <div className="space-y-3">
                <Label>
                    Address Type <span className="text-destructive">*</span>
                </Label>
                <RadioGroup className="flex gap-4" value={addressType} onValueChange={(value) => onAddressTypeChange(value as BillingAddressType)}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="home" id="home" />
                        <Label htmlFor="home" className="font-normal cursor-pointer">
                            Home Address
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="office" id="office" />
                        <Label htmlFor="office" className="font-normal cursor-pointer">
                            Office/Work Address
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>
                        Street Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        value={streetAddress}
                        onChange={(e) => onStreetAddressChange(e.target.value)}
                        placeholder="Enter street address"
                    />
                </div>
                <div className="space-y-2">
                    <Label>Street Address 2</Label>
                    <Input
                        value={streetAddress2}
                        onChange={(e) => onStreetAddress2Change(e.target.value)}
                        placeholder="Enter street address 2"
                    />
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>
                        State <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        value={state}
                        onChange={(e) => onStateChange(e.target.value)}
                        placeholder="Enter state"
                    />
                </div>
                <div className="space-y-2">
                    <Label>
                        City <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        value={city}
                        onChange={(e) => onCityChange(e.target.value)}
                        placeholder="Enter city"
                    />
                </div>
                <div className="space-y-2">
                    <Label>
                        Postal Code <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        value={postalCode}
                        onChange={(e) => onPostalCodeChange(e.target.value)}
                        placeholder="Enter postal code"
                    />
                </div>
            </div>
        </div>
    );
};
