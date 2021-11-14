import { Field, ID, ObjectType, InputType } from '@nestjs/graphql';

@InputType({ description: 'User' })
export class User {
  @Field(type => ID)
  _id: number;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field(type => [String])
  permissions: Array<string>;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  lastSeenAt: Date;

  @Field()
  enabled: boolean;
}

@InputType({ description: 'CreateUserInput' })
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType({ description: 'UpdatePasswordInput' })
export class UpdatePasswordInput {
  @Field()
  oldPassword: string;

  @Field()
  newPassword: string;
}

@InputType({ description: 'UpdateUserInput' })
export class UpdateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: UpdatePasswordInput;
}

// type Query {
//   users: [User!]!
//   user(username: String, email: String): User!
//   forgotPassword(email: String): Boolean
// }
//
// type Mutation {
//   createUser(createUserInput: CreateUserInput): User!
//   updateUser(fieldsToUpdate: UpdateUserInput!, username: String): User!
//   addAdminPermission(username: String!): User!
//   removeAdminPermission(username: String!): User!
//   resetPassword(username: String!, code: String!, password: String!): User!
// }
//
// input  {
//   password: UpdatePasswordInput
//   enabled: Boolean
// }
//
// input UpdatePasswordInput {
//   oldPassword: String!
//   newPassword: String!
// }
