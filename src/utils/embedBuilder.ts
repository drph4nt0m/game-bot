import { MessageEmbed, MessageEmbedOptions } from "discord.js";
import { EmbedColors } from "../enums/embedColors.js";

const embedBuilder = (
  options: MessageEmbedOptions,
  state: "SUCCESS" | "ERROR" | "ACTION" = "SUCCESS"
): MessageEmbed => {
  const embed = new MessageEmbed({
    color: EmbedColors[state],
    timestamp: new Date(),
    ...options,
  });
  return embed;
};

export default embedBuilder;
