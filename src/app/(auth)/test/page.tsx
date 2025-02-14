import { Badge } from "@/components/ui/badge"

export default function TestPage() {
  return (
    <div className={"w-full h-screen flex flex-col items-center justify-center"}>
      <h1>Test Page</h1>
      <Badge variant={"default"} size={"lg"}>Test Badge</Badge>
    </div>
  )
}
