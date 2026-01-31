"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkForUpdatesAction } from "@/app/actions";

export function useProjectSync(projectId: string | null) {
    const router = useRouter();
    const [lastVersion, setLastVersion] = useState<string>("");

    useEffect(() => {
        if (!projectId) return;

        const interval = setInterval(async () => {
            try {
                const res = await checkForUpdatesAction(projectId, lastVersion);
                if (res.changed) {
                    console.log(`[Sync] Remote changes detected (${res.version}), refreshing...`);
                    router.refresh();
                    if (res.version) setLastVersion(res.version);
                }
            } catch (err) {
                console.error("[Sync] Check failed:", err);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [projectId, lastVersion, router]);

    return { lastVersion, setLastVersion };
}
