import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserTeamsAction, getPendingInvitationsAction } from "@/app/actions";
import TeamDashboardClient from "@/components/TeamDashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const session = await auth();
    if (!session) {
        redirect("/login");
    }

    const { teams, error } = await getUserTeamsAction();
    const { invitations: myInvitations } = await getPendingInvitationsAction();

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F2F2F7]">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E5E5EA]">
                    <h1 className="text-xl font-bold text-red-600">Error loading dashboard</h1>
                    <p className="text-gray-500 mt-2">{error}</p>
                </div>
            </div>
        );
    }

    return <TeamDashboardClient initialTeams={teams || []} inboundInvitations={myInvitations || []} session={session} />;
}
