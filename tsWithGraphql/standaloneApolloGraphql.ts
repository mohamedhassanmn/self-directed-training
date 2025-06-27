import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from "graphql-tag"

let data=[
    {name:"rahul",age:26,},
    {name:"hassan",age:29,},
    {name:"archana",age:27,},
    {name:"anwar",age:28,},
    {name:"sourabh",age:26,},
];

type UserInfo ={
    name: string;
    age: number;
}

const typeDefs=gql`
    input UserInfoInput {
        name: String
        age: Int
    }

    type UserInfo {
        name: String
        age: Int
    }

    type Query {
        data:[UserInfo]
        aboveYear(age:Int):[UserInfo]
    }
    
    type Mutation {
        removeArchana:[UserInfo]
        addArchana:[UserInfo]
        addUser(user:UserInfoInput):[UserInfo]
    }
`

const resolvers = {
    Query: {
        data: () => data,
        aboveYear:(_:any,{age}:{age:number})=>{
            console.log(age,"age");
            return data.filter(({age:userAge})=>userAge>=age)
        }
    },
    Mutation: {
        removeArchana(){
            data = data.filter(({name})=>name!="archana")
            return data
        },
        addArchana(){
            data.push({name:"archana",age:27});
            return data
        },
        addUser(_:any,{user}:{user:UserInfo}){
            console.log(user,"user");
            data.push(user);
            return data
        }
    }
}

const server =new ApolloServer({typeDefs,resolvers});

(async() => {const {url}=await startStandaloneServer(server)
console.log(`server is ready at ${url}`)
})();
