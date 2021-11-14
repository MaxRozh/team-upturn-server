import { Field, ID, ObjectType, InputType } from '@nestjs/graphql';
import { User } from '../../users/models/users.model';

// @ObjectType({ description: 'Query' })
// export class Query {
//   @Field()
//   login(user: LoginUserInput): LoginResult;
//
//   @Field()
//   token: string;
// }

@ObjectType({ description: 'LoginResult' })
export class LoginResult {
  @Field(type => ID)
  user: User;

  @Field()
  token: string;
}

@ObjectType({ description: 'RefreshToken' })
export class RefreshToken {
  @Field()
  refreshToken: string;
}

@InputType()
export class LoginUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

// type Query {
//   login(user: LoginUserInput!): LoginResult!
//   refreshToken: String!
// }
