'use client'
import * as z from 'zod';
import {CardWrapper} from '@/components/auth/card-wrapper'
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {LoginSchema} from '@/schemas';
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
import {loginByCredential} from "@/lib/requests/client/user";

export const LoginForm = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [error, setError] = useState<string | undefined>("");

  const router = useRouter()

  const form =
    useForm<z.infer<typeof LoginSchema>>({
      resolver: zodResolver(LoginSchema),
      defaultValues: {
        email: '',
        password: '',
      },
    });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    if (isLoggingIn) {
      return
    }
    setIsLoggingIn(true)
    setError("");

    loginByCredential(values.email, values.password).then(() => {
      router.push("/dashboard")
    }).catch(({message}) => {
      setError(message)
    }).finally(()=>{
      setIsLoggingIn(false)
    })
  };

  return (
    <CardWrapper
      headerLabel={"Welcome back"}
      backButtonHref={"/register"}
      backButtonLabel={"Don't have an account?"}
      authType={"login"}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"space-y-4"}
        >
          <div className={"space-y-4"}>
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
                      disabled={isLoggingIn}
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
                      disabled={isLoggingIn}
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
            disabled={isLoggingIn}>
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
