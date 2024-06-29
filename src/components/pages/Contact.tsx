import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import AuthLayout from "./authentication/AuthLayout";

function Contact() {
  const description =
    "We value open communication with our users. Whether you have questions, suggestions, or just want to say hello, we're here to listen. Your input helps us improve our English ⇔ Darija Translator and better serve our community. We aim to respond to all messages promptly, typically within 1-2 business days. Thank you for reaching out!";
  return (
    <AuthLayout description={description}>
      <Card className="mx-auto w-full border-none md:w-[450px]">
        <CardHeader className="text-center">
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Send us a message and we'll respond as quickly as possible.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Your name" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="Your email address" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="What's this about?" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Your message here..." />
          </div>
        </CardContent>
        <CardFooter className="justify-between space-x-2">
          <Button variant="outline">Clear</Button>
          <Button>Send</Button>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}

export default Contact;
