import { QuestionRating, QuestionType } from "../enums/truthAndDare.js";
import { ITruthAndDareApiResponse } from "../interfaces/ITruthAndDareApiResponse.js";
import { api } from "./api.js";

export default class TruthAndDare {
  private static rating: QuestionRating = QuestionRating.SOFT;
  private static completedQuestions: { [id: string]: number[] } = {};

  constructor() {
    //
  }

  public static changeRating(rating: QuestionRating): void {
    this.rating = rating;
  }

  public static async getQuestion(
    user: string,
    type: QuestionType
  ): Promise<{
    id: number;
    question: string;
    type: QuestionType;
    rating: string;
  }> {
    try {
      if (!this.completedQuestions[user]) {
        this.completedQuestions[user] = [];
      }
      const { id, text } = await api<ITruthAndDareApiResponse>(
        `https://truthordarequestions.app/api/${type}/${
          this.rating
        }?exclude=${this.completedQuestions[user].join(",")}`
      );
      this.completedQuestions[user].push(id);
      return {
        id,
        question: text,
        type,
        rating:
          Object.keys(QuestionRating).find(
            (r) => QuestionRating[r] === this.rating
          ) || "Unknown",
      };
    } catch (error: any) {
      console.log(error);
      throw new Error(error.message);
    }
  }

  public static getCompletedQuestions(user: string): number[] {
    return this.completedQuestions[user] || [];
  }

  public static resetCompletedQuestions(): void {
    this.completedQuestions = {};
  }
}
