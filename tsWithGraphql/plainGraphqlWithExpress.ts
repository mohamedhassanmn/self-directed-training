import express from "express"
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import gql from "graphql-tag";

const db =[
    {name:"asma",age:28,native:"TN"},
    {name:"seema",age:30,native:"TN"},
    {name:"shivani",age:27,native:"DL"},
    {name:"pratiksha",age:26,native:"MH"},
    {name:"archana",age:26,native:"UP"}
];

type UserInfo={
    name:string;
    age:number;
    native:string
};

type UserInfoInput={
    user:UserInfo
}

const app=express();

app.use(express.json({limit:"5mb"}))

const typeDefs= gql`
    type UserInfo {
        name: String
        age: Int
        native: String
    }

    input UserInfoInput {
        name: String
        age: Int
        native: String
    }

    type Query {
        allUser: [UserInfo]
        filterNative(native: String): [UserInfo]
    }

    type Mutation {
        addUser(user: UserInfoInput): [UserInfo]
        removeUser(name: String): [UserInfo]
    }
`
const resolvers={
    Query:{
        allUser(){
            return db
        },
        filterNative(_:any,{native}:{native:string}){
            return db.filter(({native:userNative})=>userNative==native);
        }
    },
    Mutation:{
        addUser(_:any,{user}:UserInfoInput){
            db.push(user);
            return db
        },
        removeUser(_:any,{name}:{name:string}){
            const index:number=db.findIndex(({name:userName})=>userName==name);
            db.splice(index,1)
            return db
        }
    }
}

const server= new ApolloServer({typeDefs, resolvers});

(async()=>{
    await server.start()

    app.use("/graphql",expressMiddleware(server))

    app.listen(7000,()=>{
        console.log("Listening on http://localhost:7000")
    })
})()

