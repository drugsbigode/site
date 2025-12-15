import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createRecruitmentApplication } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  recruitment: router({
    submit: publicProcedure
      .input(
        z.object({
          nome: z.string().min(1),
          idade: z.number().int().positive(),
          trabalha: z.boolean(),
          discordId: z.string().min(1),
          recrutador: z.string().min(1),
        })
      )
      .mutation(async ({ input }) => {
        const application = await createRecruitmentApplication({
          nome: input.nome,
          idade: input.idade,
          trabalha: input.trabalha ? 1 : 0,
          discordId: input.discordId,
          recrutador: input.recrutador,
        });

        // Send to Discord webhook
        const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
        if (!webhookUrl) {
          throw new Error("Discord webhook URL not configured");
        }

        const discordMessage = {
          content: `<@${input.discordId}>`,
          embeds: [
            {
              title: "Nova Inscrição - Os Raul",
              color: 16777215,
              fields: [
                {
                  name: "Nome (Roblox)",
                  value: input.nome,
                  inline: true,
                },
                {
                  name: "Idade",
                  value: input.idade.toString(),
                  inline: true,
                },
                {
                  name: "Trabalha",
                  value: input.trabalha ? "Sim" : "Não",
                  inline: true,
                },
                {
                  name: "ID do Discord",
                  value: input.discordId,
                  inline: true,
                },
                {
                  name: "Recrutado por",
                  value: input.recrutador,
                  inline: true,
                },
              ],
              timestamp: new Date().toISOString(),
            },
          ],
        };

        try {
          const response = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(discordMessage),
          });

          if (!response.ok) {
            throw new Error(`Discord webhook failed: ${response.statusText}`);
          }
        } catch (error) {
          console.error("Failed to send Discord webhook:", error);
          throw new Error("Failed to process application");
        }

        return {
          success: true,
          applicationId: application.id,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
