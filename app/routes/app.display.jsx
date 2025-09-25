import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  Avatar,
  Divider,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

const contacts = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane.doe@email.com",
    phone: "+1 234 567 8900",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    description:
      "Head of Customer Success. Reach out with any questions or support needs!",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 987 654 3210",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
    description:
      "Senior Developer. Available for technical assistance and integration inquiries.",
  },
];

function ContactCard({ contact }) {
  return (
    <Card>
      <BlockStack gap="400" paddingBlock="400">
        <InlineStack gap="400" align="start">
          <Avatar size="large" name={contact.name} source={contact.image} />

          <BlockStack gap="100" alignment="leading">
            <Text variant="headingMd" as="h1">
              {contact.name}
            </Text>
            <Text variant="bodyMd" color="subdued">
              {contact.description}
            </Text>
          </BlockStack>
        </InlineStack>

        <Divider />

        <BlockStack gap="200" paddingInline="200">
          <Box>
            <Text variant="bodySm" color="subdued">
              Email
            </Text>
            <Text as="p" variant="bodyMd">
              <Link url={`mailto:${contact.email}`}>{contact.email}</Link>
            </Text>
          </Box>
          <Box>
            <Text variant="bodySm" color="subdued">
              Phone
            </Text>
            <Text as="p" variant="bodyMd">
              <Link url={`tel:${contact.phone}`}>{contact.phone}</Link>
            </Text>
          </Box>
        </BlockStack>
      </BlockStack>
    </Card>
  );
}

export default function AdditionalPage() {
  return (
    <Page>
      <TitleBar title="Contact Info" />

      <Layout>
        <Layout.Section>
          <BlockStack gap="400">
            {contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </BlockStack>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <Card>
            <BlockStack gap="200" paddingBlock="400" paddingInline="400">
              <Text as="h2" variant="headingMd">
                Resources
              </Text>
              <List>
                <List.Item>
                  <Link
                    url="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
                    target="_blank"
                    removeUnderline
                  >
                    App nav best practices
                  </Link>
                </List.Item>
              </List>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
