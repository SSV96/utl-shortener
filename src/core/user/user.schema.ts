import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
class User {
  @Prop({ type: String, default: () => uuid() })
  _id: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  email: string;
}

const UserSchema = SchemaFactory.createForClass(User);
type UserDocument = HydratedDocument<User>;

export { User, UserSchema, UserDocument };
