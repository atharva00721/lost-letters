"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createLetter } from "@/actions/letter";

const formSchema = z.object({
  receiver: z
    .string()
    .min(2, { message: "Receiver name must be at least 2 characters." }),
  content: z.string().min(1, { message: "Content is required." }),
});

export default function UserDetailsForm({
  onSubmit,
  userIp = "127.0.0.1", // Default IP or pass from server component
}: {
  onSubmit?: (data: { receiver: string; content: string }) => void;
  userIp?: string;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [contentLength, setContentLength] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      receiver: "",
      content: "",
    },
  });

  async function handleFormSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setErrorMessage(null);
    setWarningMessage(null);

    try {
      // Call our server action with content moderation
      const result = await createLetter({
        name: values.receiver,
        message: values.content,
        ip: userIp,
      });

      if (result.success) {
        setSubmitted(true);

        // Check if content was filtered and show warning if it was
        if (result.wasContentFiltered && result.message) {
          setWarningMessage(result.message);
        }

        if (onSubmit) onSubmit(values);
        form.reset();
        setContentLength(0);
        setTimeout(() => setSubmitted(false), 2500);
      } else {
        // Handle specific moderation errors
        if (result.moderationDetails) {
          let errorMsg =
            result.error || "Your message contains inappropriate content";

          // Add more specific details if available
          if (result.moderationDetails.message) {
            errorMsg += `: ${result.moderationDetails.message}`;
          }

          setErrorMessage(errorMsg);
        } else {
          // Handle generic errors
          setErrorMessage(
            result.error ||
              "Failed to submit your letter. Please try again later."
          );
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="max-w-md mx-auto mt-10 bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-main">
          Send a Letter
        </CardTitle>
        <CardDescription>
          Share your thoughts with someone special.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="receiver"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">To</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter receiver's name"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Your Message
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder="Write your letter here..."
                          rows={8}
                          maxLength={500}
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setContentLength(e.target.value.length);
                          }}
                          className="pr-16 resize-none min-h-[180px] bg-white/80"
                        />
                        <span className="absolute bottom-2 right-3 text-xs text-muted-foreground bg-white/60 px-1.5 py-0.5 rounded">
                          {contentLength}/500
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMessage && (
                <div className="text-red-600 text-sm font-medium p-3 bg-red-50 rounded-md border border-red-200">
                  {errorMessage}
                </div>
              )}

              {warningMessage && (
                <div className="text-amber-600 text-sm font-medium p-3 bg-amber-50 rounded-md border border-amber-200">
                  {warningMessage}
                </div>
              )}

              <Button
                type="submit"
                className="w-full text-lg py-6 font-semibold transition-all shadow-sm hover:shadow-md"
                disabled={submitted || isSubmitting}
              >
                {isSubmitting
                  ? "Sharing..."
                  : submitted
                  ? "Shared!"
                  : "Share Letter"}
              </Button>

              {submitted && (
                <div className="text-green-600 text-center font-medium bg-green-50 p-3 rounded-md border border-green-200 mt-3">
                  Your letter has been shared!
                </div>
              )}
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}
