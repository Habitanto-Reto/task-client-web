import NextAuth, {type NextAuthConfig} from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import {IUser} from "../nextauth";
import {jwtDecode} from "jwt-decode";
import {AuthDatasourcesImpl} from "@/app/api/infrastructure/datasources/authDatasourcesImpl";
import {AuthRepositoryImpl} from "@/app/api/infrastructure/repositories/authRepositoryImpl";

interface DecodedToken {
    uuid: string;
    email: string;
    username: string;
    iat: number;
    exp: number;
}

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/new-account',
    },

    callbacks: {

        authorized({ auth, request: { nextUrl } }) {
            console.log({ auth });
            // const isLoggedIn = !!auth?.user;

            // const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            // if (isOnDashboard) {
            //   if (isLoggedIn) return true;
            //   return false; // Redirect unauthenticated users to login page
            // } else if (isLoggedIn) {
            //   return Response.redirect(new URL('/dashboard', nextUrl));
            // }
            return true;
        },

        jwt({ token, user }) {
            if ( user ) {
                token.data = user;
                const myUser = user as IUser;
                token.name = myUser.name;
                token.email = myUser.email;
                token.username = myUser.username;
                token.token = myUser.token;
                const decodedToken: DecodedToken = jwtDecode(myUser.token);
                token.uuid = decodedToken.uuid;
            }

            return token;
        },

        session({ session, token, user }) {
            session.user = token.data as any;
            return session;
        },
    },

    providers: [

        Credentials({
            async authorize(credentials) {
                const authDatasource = new AuthDatasourcesImpl();
                const authRepository = new AuthRepositoryImpl(authDatasource);
                const authData = {
                    email: credentials?.email,
                    password: credentials?.password,
                };

                return await authRepository.loginUser(authData);
            },
        }),
    ]
}

export const {  signIn, signOut, auth, handlers } = NextAuth( authConfig );