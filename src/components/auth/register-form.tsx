'use client'
import * as z from 'zod';
import {CardWrapper} from '@/components/auth/card-wrapper'
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {RegisterSchema} from '@/schemas';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {FormError} from '@/components/form-error';


import {useState} from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { useRouter } from 'next/navigation';
import {signupByCredential} from "@/lib/requests/client/user";

export const RegisterForm = () => {
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [error, setError] = useState<string | undefined>("");

  const router = useRouter()

  const form =
    useForm<z.infer<typeof RegisterSchema>>({
      resolver: zodResolver(RegisterSchema),
      defaultValues: {
        email: '',
        password: '',
        name: '',
      },
    });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    if (isSigningUp) {
      return
    }
    setError("");
    setIsSigningUp(true)

    signupByCredential(values.name, values.email, values.password).then(() => {
      router.push("/dashboard")
    }).catch(({message}) => {
      setError(message)
    }).finally(()=>{
      setIsSigningUp(false)
    })
  };

  return (
    <CardWrapper
      headerLabel={"Create an account"}
      backButtonHref={"/login"}
      backButtonLabel={"Already have an account?"}
      authType="signup"
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"space-y-4"}
        >
          <div className={"space-y-4"}>
            <FormField
              control={form.control}
              name="name"
              render={(
                {field}) => (
                <FormItem>
                  <FormLabel>
                    Your Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSigningUp}
                      placeholder={"haper"}
                      type={"name"}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )
              }>
            </FormField>
            <FormField
              control={form.control}
              name="email"
              render={(
                {field}) => (
                <FormItem>
                  <FormLabel>
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSigningUp}
                      placeholder={"haper@example.com"}
                      type={"email"}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )
              }>
            </FormField>
            <FormField
              control={form.control}
              name="password"
              render={(
                {field}) => (
                <FormItem>
                  <FormLabel>
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isSigningUp}
                      placeholder={"********"}
                      type={"password"}
                    />
                  </FormControl>
                  <FormMessage/>
                </FormItem>
              )
              }>
            </FormField>
          </div>
          <FormError message={error}/>
          <Button
            type={"submit"}
            className={"w-full"}
            disabled={isSigningUp}>
            Create account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
