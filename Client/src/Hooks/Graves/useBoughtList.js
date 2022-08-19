import { useQuery } from "@tanstack/react-query"
import axios from "axios";
import { GRAPHQL_URL } from "../../Utils/serviceURLConfig";

const BOUGHT_GRAVES_QUERY = `
{
    exampleEntities {
        id
        count
        _graveYardAddress
        _to
      }
  }
`;

const getBoughtList = async () => {
    const { data } = await axios({
        url: `${GRAPHQL_URL}${'cemeterybuy'}`,
        method: "POST",
        data: {
            query: BOUGHT_GRAVES_QUERY
        }
    });
    return data
}

export const useGetBoughtGraveList = (onSuccess) => {
    return useQuery(["boughtGraveList"], () => getBoughtList(), {
        onSuccess
    }
    )
}