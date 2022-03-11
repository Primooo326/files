export enum resultType {
  SUCCESS,
  WARNING,
  ERROR,
  INFO,
}

export interface IResult {
  message: string;
  status: boolean;
  type: resultType;
  data: any;
}
