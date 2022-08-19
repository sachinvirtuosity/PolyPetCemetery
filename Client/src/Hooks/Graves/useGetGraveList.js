import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import { GRAPHQL_URL } from "../../Utils/serviceURLConfig";

const FILMS_QUERY = `
{
    tokens {
      id
      tokenID
      from
      owner
      lat
      long
      graveYardAddress
    }
  }
`;

const getBuyList = async (graveYard) => {
    const { data } = await axios({
        url: `${GRAPHQL_URL}${graveYard}`,
        method: "POST",
        data: {
            query: FILMS_QUERY
        }
    });
    return data
}

export const useGetGraveList = (graveYard, onSuccess) => {
    return useQuery(["graveList", graveYard], () => getBuyList(graveYard), {
        onSuccess
    }
    )
}