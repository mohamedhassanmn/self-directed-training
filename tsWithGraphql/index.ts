import "reflect-metadata";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { Arg, buildSchema, Ctx, Field, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";

const db = [
  { name: "asma", age: 28, native: "TN" },
  { name: "seema", age: 30, native: "TN" },
  { name: "shivani", age: 27, native: "DL" },
  { name: "pratiksha", age: 26, native: "MH" },
  { name: "archana", age: 26, native: "UP" }
];

const app = express();
app.use(express.json({ limit: "5mb" }));

@ObjectType()
class UserInfo {
  @Field(() => String)
  public name: string;

  @Field(() => Int)
  public age: number;

  @Field(() => String)
  public native: string;
}

@Resolver()
class UserResolver {
  @Query(() => [UserInfo])
  allUser(@Ctx() context:any) {
    console.log(context)
    return db;
  }

  @Query(() => [UserInfo])
  filterByNative(@Arg("native") native: string) {
    return db.filter(({ native: userNative }) => userNative === native);
  }

  @Mutation(() => [UserInfo])
  addUser(
    @Arg("name") name: string,
    @Arg("age", () => Int) age: number,
    @Arg("native") native: string
  ) {
    db.push({ name, age, native });
    return db;
  }

  @Mutation(() => [UserInfo])
  removeUser(@Arg("name") name: string) {
    const index = db.findIndex(({ name: userName }) => userName === name);
    if (index !== -1) {
      db.splice(index, 1);
    }
    return db;
  }
}

(async () => {
  const schema = await buildSchema({
    resolvers: [UserResolver]
  });

  const server = new ApolloServer({ schema });
  await server.start();

  app.use("/graphql", expressMiddleware(server, { context:async () => ({ db })  }));

  app.listen(7000, () => {
    console.log("🚀 Listening on http://localhost:7000/graphql");
  });
})();
