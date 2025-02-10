import {Header} from '@/components/auth/header';
import {BackButton} from '@/components/auth/back-button';
import {
  Card,
  CardFooter,
  CardHeader
} from "@/components/ui/card";

export const ErrorCard = ({message}: {message: string}) => {
  return (
    <Card className={"w-[400px] shadow-md"}>
      <CardHeader>
        <Header label={message}/>
      </CardHeader>
      <div className={"p-4"}>
        <h1 className={"text-2xl font-bold"}>Error</h1>
      </div>
      <CardFooter>
        <BackButton
          label={"Back to login"}
          href={"/login"}
        />
        <BackButton
          label={"Back to register"}
          href={"/register"}
        />
      </CardFooter>
    </Card>
  )
}
