import { Suspense } from "react";
import DigiLockerCallbackInner from "./DigiLockerCallbackInner";

export default function Page() {
    return (
        <Suspense fallback={<p className="text-center mt-10">Loading…</p>}>
            <DigiLockerCallbackInner />
        </Suspense>
    );
}