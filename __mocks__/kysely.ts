import { vi } from "vitest";

/* 
  Use this to set any return value from db-calls that you ever need: 

  import { setReturnValue } from "@/__mocks__/kysely";
  setReturnValue([...]);

*/

let returnValue: any = null;

function kysely(): any {
  return {
    query: vi.fn(kysely),
    selectFrom: vi.fn(kysely),
    selectAll: vi.fn(kysely),
    execute: vi.fn(() => {
      return returnValue;
    }),
    setReturnValue: (val: any) => {
      returnValue = val;
    },
  };
}

export const setReturnValue = (val: any) => {
  returnValue = val;
};

export const createKysely = vi.fn(kysely);
