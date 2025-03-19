import { ITicket } from "@/@types/ticket";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GetTicketById } from "@/services/tickets.service";
import globalStyles from "@/styles/globalStyles";
import { useSearchParams } from "expo-router/build/hooks";
import moment from "moment";
import "moment/locale/pt-br";
import { useEffect, useState } from "react";
import { Image } from "react-native";

export default function TicketDetailsScreen() {
  const [ticket, setTicket] = useState<ITicket | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchTicket = async () => {
      const id = searchParams.get("id");
      if (!id) return;

      const response = await GetTicketById(id);
      setTicket(response.data);
    };
    fetchTicket();
  }, [searchParams]);

  if (!ticket) {
    return <ThemedText type="title">Loading...</ThemedText>;
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/takeaticketbanner.png")}
          style={globalStyles.takeaticketLogo}
        />
      }
    >
      <ThemedView style={globalStyles.container}>
        <ThemedText type="title" style={{ marginBottom: 5 }}>
          {ticket.title}
        </ThemedText>
        <ThemedView style={{ flexDirection: "row", marginBottom: 5 }}>
          <ThemedText type="defaultSemiBold">Status: </ThemedText>
          <ThemedText type="default">{ticket.status}</ThemedText>
        </ThemedView>
        <ThemedView style={{ flexDirection: "row", marginBottom: 5 }}>
          <ThemedText type="defaultSemiBold">Description: </ThemedText>
          <ThemedText type="default">{ticket.description}</ThemedText>
        </ThemedView>
        <ThemedView style={{ flexDirection: "row" }}>
          <ThemedText type="defaultSemiBold">Deadline: </ThemedText>
          <ThemedText type="default">
            {" "}
            {moment(ticket.deadline).format("DD/MM-HH:mm")}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}
