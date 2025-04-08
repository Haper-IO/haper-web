import {RichText} from "@/lib/modal/rich-text";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

interface RichContentProps {
  richTextList: RichText[]
}

export default function RichContent(props: RichContentProps) {
  const {richTextList} = props;


  return (
    <div className="text-sm">
      {richTextList.map((richText, index) => {
        if (richText.type == "text") {
          console.log(richText.text!.content);
          return richText.text!.content
        } else if (richText.type == "email") {
          return (
            <
              TooltipProvider
              key={index}
            >
              <Tooltip>
                <TooltipTrigger asChild className="text-pink-500">
                  <span className="hover:underline">{richText.email!.name}</span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{richText.email!.address}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
        }
      })}
    </div>
  );

}
