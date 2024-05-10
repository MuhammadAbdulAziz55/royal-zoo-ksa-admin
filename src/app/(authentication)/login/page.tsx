"use client";

import { signIn } from "next-auth/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Username must be at least 3 characters.",
    })
    .regex(/^(?!^\d+$)[\S\s]+$/, {
      message: "Only string allow",
    }),
  password: z.string().min(3, {
    message: "password must be at least 3 characters.",
  }),
});

import { useRouter } from "next/navigation";
import { useState } from "react";

const UserLogin = () => {
  const router = useRouter();
  const [isError, setError] = useState("");
  // default value and error resolve
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // form data
  async function onSubmit(values: z.infer<typeof formSchema>) {
    //
    const res = await signIn("credentials", {
      username: values.username,
      password: values.password,
      redirect: false,
    });

    setError("");

    if (res?.error) {
      setError("username or password wrong");
      console.log("Sign-in error", res.error);
      // Handle the error, e.g., show a message to the user
    } else {
      router.replace("/"); // Redirect to the home page or another page
    }

    // if successfully login then page redirect
    // router.push("/");
  }

  return (
    <div className="container">
      <div className="max-w-2/3 flex justify-center items-center h-screen">
        <Card>
          <CardHeader>
            <CardTitle>Admin Account</CardTitle>
            <CardDescription> welcome to our Aamar Pharma.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Username<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          password<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="active:scale-75">
                    Submit
                  </Button>
                  <div>
                    {isError && <span className="text-red-600">{isError}</span>}
                  </div>
                </form>
              </Form>
            </div>
          </CardContent>
          {/* <CardFooter>
            <Button>Save changes</Button>
          </CardFooter> */}
        </Card>
      </div>
    </div>
  );
};

export default UserLogin;
