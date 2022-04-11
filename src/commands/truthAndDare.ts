import type { ButtonInteraction, CommandInteraction } from "discord.js";
import { GuildMember, MessageActionRow, MessageButton, MessageSelectMenu, SelectMenuInteraction } from "discord.js";
import { ButtonComponent, Discord, SelectMenuComponent, Slash, SlashOption } from "discordx";
import { QuestionRating, QuestionType } from "../enums/truthAndDare.js";
import TruthAndDare from "../utils/truthAndDare.js";
import embedBuilder from "../utils/embedBuilder.js";

@Discord()
export class TruthAndDareCommand {
  @Slash("truth-and-dare")
  async game(
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.deferReply();

    const ratingMenu = new MessageSelectMenu()
      .addOptions(
        Object.keys(QuestionRating)
          .filter((r) => isNaN(Number(r)))
          .map((r: any) => ({ label: r, value: QuestionRating[r] }))
      )
      .setPlaceholder("Select a Rating")
      .setCustomId("change-rating-menu");

    const row = new MessageActionRow().addComponents(ratingMenu);

    const replyEmbed = embedBuilder(
      {
        title: "Truth or Dare",
        description: "A game of Truth or Dare has begun, please select a rating."
      },
      "ACTION"
    );

    await interaction.editReply({
      components: [row],
      embeds: [replyEmbed]
    });
  }

  @ButtonComponent(/game-*/)
  async gameBtn(interaction: ButtonInteraction): Promise<void> {
    await interaction.deferReply();
    const questionType = interaction.customId.replace(/^game-/, "") as QuestionType;

    const truthBtn = new MessageButton()
      .setLabel("Truth")
      // .setEmoji("👋")
      .setStyle("SUCCESS")
      .setCustomId("game-truth");

    const dareBtn = new MessageButton()
      .setLabel("Dare")
      // .setEmoji("👋")
      .setStyle("DANGER")
      .setCustomId("game-dare");

    const changeRatingBtn = new MessageButton()
      .setLabel("Change Rating")
      // .setEmoji("👋")
      .setStyle("SECONDARY")
      .setCustomId("change-rating");

    const row = new MessageActionRow().addComponents(truthBtn, dareBtn, changeRatingBtn);

    try {
      const { id, question, type, rating } = await TruthAndDare.getQuestion(interaction.user.id, questionType);
      const footer = `Type: ${type.toUpperCase()} • Rating: ${rating.toUpperCase()} • ID: ${id} • Asked by: ${interaction.user.username}`;
      const replyEmbed = embedBuilder({ title: question, footer: { text: footer } });
      await interaction.editReply({
        components: [row],
        embeds: [replyEmbed]
      });
    } catch (error: any) {
      const replyEmbed = embedBuilder({ title: "Error", description: error.message }, "ERROR");
      await interaction.editReply({
        components: [row],
        embeds: [replyEmbed]
      });
    } finally {
      const message = await interaction.channel?.messages.fetch(interaction.message.id);
      if (message) {
        await message.edit({
          components: []
        })
      }
    }
  }

  @ButtonComponent("change-rating")
  async changeRatingBtn(interaction: ButtonInteraction): Promise<void> {
    await interaction.deferReply();

    const ratingMenu = new MessageSelectMenu()
      .addOptions(
        Object.keys(QuestionRating)
          .filter((r) => isNaN(Number(r)))
          .map((r: any) => ({ label: r, value: QuestionRating[r] }))
      )
      .setPlaceholder("Select a Rating")
      .setCustomId("change-rating-menu");

    const row = new MessageActionRow().addComponents(ratingMenu);

    const replyEmbed = embedBuilder(
      {
        title: "Truth or Dare",
        description: "Please select a rating."
      },
      "ACTION"
    );

    await interaction.editReply({
      components: [row],
      embeds: [replyEmbed]
    });

    const message = await interaction.channel?.messages.fetch(interaction.message.id);
    if (message) {
      await message.edit({
        components: []
      })
    }
  }

  @SelectMenuComponent("change-rating-menu")
  async changeRatingMenu(interaction: SelectMenuInteraction): Promise<void> {
    await interaction.deferReply();
    const ratingValue = interaction.values?.[0] as QuestionRating;
    TruthAndDare.changeRating(ratingValue);

    const truthBtn = new MessageButton()
      .setLabel("Truth")
      // .setEmoji("👋")
      .setStyle("SUCCESS")
      .setCustomId("game-truth");

    const dareBtn = new MessageButton()
      .setLabel("Dare")
      // .setEmoji("👋")
      .setStyle("DANGER")
      .setCustomId("game-dare");

    const changeRatingBtn = new MessageButton()
      .setLabel("Change Rating")
      // .setEmoji("👋")
      .setStyle("SECONDARY")
      .setCustomId("change-rating");

    const row = new MessageActionRow().addComponents(truthBtn, dareBtn, changeRatingBtn);

    const replyEmbed = embedBuilder(
      {
        title: "Truth or Dare",
        description: "Rating updated!"
      },
      "ACTION"
    );

    await interaction.editReply({
      components: [row],
      embeds: [replyEmbed]
    });

    const message = await interaction.channel?.messages.fetch(interaction.message.id);
    if (message) {
      await message.edit({
        components: []
      })
    }
  }

  @Slash("completed-questions")
  async completedQuestions(
    @SlashOption("user", { description: "Check stats for which user?", type: "USER" })
      member: GuildMember,
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.deferReply();

    const questions = TruthAndDare.getCompletedQuestions(member.id);
    const replyEmbed = embedBuilder({
      title: `Questions asked by ${member.user.username}`,
      description: `\`\`\`${questions.join(", ") || "None"}\`\`\``
    }, "ACTION");

    await interaction.editReply({
      embeds: [replyEmbed]
    });
  }

  @Slash("reset-completed-questions")
  async resetCompletedQuestions(
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.deferReply();

    TruthAndDare.resetCompletedQuestions();
    const replyEmbed = embedBuilder({
      title: `Completed questions tracking reset`,
    }, "ACTION");

    await interaction.editReply({
      embeds: [replyEmbed]
    });
  }
}
