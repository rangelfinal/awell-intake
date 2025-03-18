import { useMedplum } from '@medplum/react';
import { Patient } from '@medplum/fhirtypes';
import {
  Table,
  Card,
  Text,
  Group,
  TextInput,
  ActionIcon,
  Container,
  Title,
  Stack,
  Badge
} from '@mantine/core';
import { IconSearch, IconChevronRight } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function PatientList() {
  const medplum = useMedplum();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const results = await medplum.searchResources('Patient', {});
      setPatients(results);
    };
    fetchPatients();
  }, [medplum]);

  const filteredPatients = patients.filter(patient =>
    `${patient.name?.[0]?.given?.[0]} ${patient.name?.[0]?.family}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Container size="xl" mt="xl">
      <Stack spacing="md">
        <Group justify="space-between">
          <Title order={2} color="blue.9">Patients</Title>
          <TextInput
            placeholder="Search patients..."
            icon={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: 300 }}
          />
        </Group>

        <Card shadow="sm" p="md" radius="md" withBorder>
          <Table
            highlightOnHover
            verticalSpacing="md"
            horizontalSpacing="lg"
            styles={{
              th: {
                padding: '0 0 1rem 0',
                fontWeight: 600,
              },
            }}
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Date of Birth</Table.Th>
                <Table.Th>Gender</Table.Th>
                <Table.Th>MRN</Table.Th>
                <Table.Th style={{ width: 50 }}></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredPatients.map((patient) => (
                <Table.Tr
                  key={patient.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/patients/${patient.id}`)}
                >
                  <td>
                    <Group spacing="sm">
                      <div>
                        <Text weight={500}>
                          {patient.name?.[0]?.given?.[0]} {patient.name?.[0]?.family}
                        </Text>
                        {patient.telecom?.[0]?.value && (
                          <Text size="xs" color="dimmed">
                            {patient.telecom[0].value}
                          </Text>
                        )}
                      </div>
                    </Group>
                  </td>
                  <td>
                    <Text>{patient.birthDate && formatDate(patient.birthDate)}</Text>
                  </td>
                  <td>
                    <Badge
                      color={patient.gender === 'male' ? 'blue' : 'pink'}
                      variant="light"
                    >
                      {patient.gender?.charAt(0).toUpperCase() + patient.gender?.slice(1)}
                    </Badge>
                  </td>
                  <td>
                    <Text color="dimmed" size="sm">
                      {patient.id?.slice(0, 8)}
                    </Text>
                  </td>
                  <td>
                    <ActionIcon color="blue" variant="subtle">
                      <IconChevronRight size={16} />
                    </ActionIcon>
                  </td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Stack>
    </Container>
  );
}