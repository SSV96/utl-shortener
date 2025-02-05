import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
class Shorten {
  @Prop({ type: String, default: () => uuid() })
  _id: string;

  @Prop({ type: String, required: true })
  userId: string;

  @Prop({
    type: String,
    required: true,
  })
  longUrl: string;

  @Prop({
    type: String,
    default: null,
  })
  customAlias: string;

  @Prop({
    type: String,
    required: true,
  })
  topic: string;
}

const ShortenSchema = SchemaFactory.createForClass(Shorten);
type ShortenDocument = HydratedDocument<Shorten>;

export { Shorten, ShortenSchema, ShortenDocument };
