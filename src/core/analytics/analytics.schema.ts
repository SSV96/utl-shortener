import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuid } from 'uuid';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
class Analytics {
  @Prop({ type: String, default: () => uuid() })
  _id: string;

  @Prop({ type: String, required: true })
  ipAddress: string;

  @Prop({ type: String, default: null })
  customAlias: string;

  @Prop({ type: String, default: null })
  urlId: string;

  @Prop({ type: String, required: true })
  topic: string;

  @Prop({ type: String, required: true })
  deviceName: string;

  @Prop({ type: String, required: true })
  osName: string;

  @Prop({ type: Number, required: true, default: 0 })
  clickCount: number;

  @Prop({ type: String, required: true })
  date: string;
}

const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
type AnalyticsDocument = HydratedDocument<Analytics>;

export { Analytics, AnalyticsSchema, AnalyticsDocument };
