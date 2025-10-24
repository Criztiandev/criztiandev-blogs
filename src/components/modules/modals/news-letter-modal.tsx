"use client";

import { MailIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ShinyButton } from "@/components/ui/shiny-button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function NewsLetterModal() {
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const subscribeMutation = trpc.newsletter.subscribe.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setEmail("");
      setIsOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    subscribeMutation.mutate({ email });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <ShinyButton className="bg-primary flex items-center justify-center rounded-full p-4">
          <span className="text-primary-foreground text-base font-semibold">Get in Touch</span>
        </ShinyButton>
      </DialogTrigger>
      <DialogContent>
        <div className="mb-2 flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <svg
              className="stroke-zinc-800 dark:stroke-zinc-100"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
            </svg>
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">Never miss an update</DialogTitle>
            <DialogDescription className="sm:text-center">
              Subscribe to receive news and special offers.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="*:not-first:mt-2">
            <div className="relative">
              <Input
                id="dialog-subscribe"
                className="peer ps-9"
                placeholder="hi@yourcompany.com"
                type="email"
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={subscribeMutation.isPending}
                required
              />
              <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                <MailIcon size={16} aria-hidden="true" />
              </div>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={subscribeMutation.isPending}>
            {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-xs">
          By subscribing you agree to our{" "}
          <a className="underline hover:no-underline" href="#">
            Privacy Policy
          </a>
          .
        </p>
      </DialogContent>
    </Dialog>
  );
}
