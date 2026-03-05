import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserRole } from "@/types/user";

export default async function DashboardRedirect() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/signin");
    }

    const role = (session.user as any).role;

    if (role === UserRole.SUPER_ADMIN) {
        redirect("/super-admin/dashboard");
    } else if (role === UserRole.ADMIN) {
        redirect("/admin/dashboard");
    } else {
        redirect("/student/dashboard");
    }
}
