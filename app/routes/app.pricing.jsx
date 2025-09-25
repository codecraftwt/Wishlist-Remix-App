import {
  Box,
  Card,
  Layout,
  Page,
  Text,
  BlockStack,
  Button,
  Divider,
  InlineStack,
  Badge,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

const CARD_HEIGHT = "320px";
const CARD_WIDTH = "300px";

const plans = [
  {
    name: "Basic",
    price: "$19/mo",
    features: [
      "Up to 100 products",
      "Email support",
      "Basic analytics",
    ],
    badge: "Most popular",
    highlight: true,
  },
  {
    name: "Pro",
    price: "$49/mo",
    features: [
      "Unlimited products",
      "Priority support",
      "Advanced analytics",
      "Custom domain",
    ],
    badge: null,
    highlight: false,
  },
  {
    name: "Enterprise",
    price: "Contact us",
    features: [
      "White-glove onboarding",
      "Dedicated account manager",
      "Custom integrations",
      "All Pro features",
    ],
    badge: "Best value",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <Page>
      <TitleBar title="Pricing Plans" />
      <BlockStack gap="500">
        <Text variant="headingLg" as="h1" alignment="center">
          Choose your plan
        </Text>
        <Text variant="bodyMd" alignment="center" color="subdued">
          Flexible pricing for every stage of your business. Upgrade or downgrade anytime.
        </Text>
        <Layout>
          {plans.map((plan) => (
            <Layout.Section key={plan.name} variant="oneThird">
              <Card>
                <Box
                  minHeight={CARD_HEIGHT}
                  maxWidth={CARD_WIDTH}
                  width="100%"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text variant="headingMd">{plan.name}</Text>
                      {plan.badge && (
                        <Badge status={plan.highlight ? "info" : "attention"}>
                          {plan.badge}
                        </Badge>
                      )}
                    </InlineStack>
                    <Divider />
                    <Text variant="headingXl" as="p">
                      {plan.price}
                    </Text>
                    <BlockStack gap="100">
                      {plan.features.map((feature, idx) => (
                        <Text key={idx} variant="bodyMd">
                          • {feature}
                        </Text>
                      ))}
                    </BlockStack>
                  </BlockStack>
                  <Box paddingBlockStart="200">
                    <Button primary={plan.highlight}>
                      Choose {plan.name}
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Layout.Section>
          ))}
        </Layout>
      </BlockStack>
    </Page>
  );
}
