import {auth, signOut} from "@/auth.config";
import {redirect} from "next/navigation";
import {LogoutButton} from "@/components/sidebar/LogoutButton";

export default async function ShopLayout( { children }: {
    children: React.ReactNode;
} ) {
    const session = await auth();

    if ( !session?.user ) {
        //redirect('/auth/login?returnTo=/tasks');
        redirect('/auth/login');
    }

    return (
        <main className="flex justify-center">
            <div className="w-full sm:w-[350px] px-10">
            <LogoutButton/>
            { children }
            </div>
        </main>
    );
}