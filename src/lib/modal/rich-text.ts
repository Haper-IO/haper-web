// Rich Text Related Interfaces
interface Annotation {
  bold: boolean;
}

interface TextContent {
  content: string;
}

interface EmailContent {
  name: string;
  address: string;
}

export interface RichText {
  type: "text" | "email";
  text?: TextContent;
  email?: EmailContent;
  annotations?: Annotation;
}
