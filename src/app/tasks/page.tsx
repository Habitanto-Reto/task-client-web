import {auth} from "@/auth.config";

export default async function Tasks() {
    const session = await auth();

    return (
        <div>
            <h1>usuario conectado server side
                {JSON.stringify(session!.user, null, 2)}
            </h1>
        </div>
    );
}
