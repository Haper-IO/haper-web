import BackgroundPaths from "@/components/background-effect/bg-path-lines";

const AuthLayout = ({
  children } : {
  children: React.ReactNode }) => {
  return (
    <div className={"flex items-center justify-center min-h-screen"}>
      {children}

    </div>

  )
    ;
}

export default AuthLayout;
