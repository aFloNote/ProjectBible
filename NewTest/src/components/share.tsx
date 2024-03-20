import {
  FaShareAlt,
  FaFacebook,
  FaTwitter,
  FaRedditAlien,
  FaCopy,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Input } from "@/components/ui/input";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FacebookShareButton,
  TwitterShareButton,
  RedditShareButton,
  LinkedinShareButton,
  EmailShareButton,
  WhatsappShareButton,
} from "react-share";

export function Share() {
  const shareUrl = window.location.href;

  const slug = window.location.href.split("/").pop();
  if (slug === undefined) {
    return null;
  }
  const titles = slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  const title =
    "Listen to " + titles + " from Faith Bible Church Treasure Valley!";
  const size=20;
  return (
    <div className="">
      <div className="flex items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="text-2xl text-sm">
              <FaShareAlt />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-46 pr-10 ">
            <div className="flex justify-between">
              <FacebookShareButton url={shareUrl} title={title}>
                <FaFacebook size={size} />
              </FacebookShareButton>

              <TwitterShareButton url={shareUrl} title={title}>
                <FaTwitter size={size} />
              </TwitterShareButton>

              <RedditShareButton url={shareUrl} title={title}>
                <FaRedditAlien size={size} />
              </RedditShareButton>

              <LinkedinShareButton url={shareUrl} title={title}>
                <FaLinkedin size={size}/>
              </LinkedinShareButton>
              <EmailShareButton
                url={shareUrl}
                subject={title}
                body={"Listen to "+titles+" from Faith Bible Church Treasure Valley!"}
              >
                <FaEnvelope size={size}/>
              </EmailShareButton>

              <WhatsappShareButton url={shareUrl} title={title}>
                <FaWhatsapp size={size}/>
              </WhatsappShareButton>
            </div>

            <div className="mt-2 flex items-center">
              <Input
                type="text"
                value={shareUrl}
                readOnly
                className="overflow-ellipsis whitespace-nowrap"
              />
              <CopyToClipboard text={shareUrl}>
                <Button
                  variant="ghost"
                  className="text-2xl text-sm ml-2 px-1 pt-1"
                >
                  <FaCopy size={size}/>
                </Button>
              </CopyToClipboard>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
