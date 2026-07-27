import { gql } from "@apollo/client";

export const GET_DEFAULT_CHANNEL = gql`
  query getDefaultChannel {
    channels {
      edges {
        node {
          id
          code
          logoUrl
          faviconUrl
          translation {
            name
            description
            homeSeo
          }
        }
      }
    }
  }
`;
