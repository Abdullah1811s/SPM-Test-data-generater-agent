import { faker } from '@faker-js/faker';

function detectFieldType(fieldName, ruleType) {
    if (ruleType) return ruleType.toLowerCase();
    const lower = fieldName.toLowerCase();
    if (lower.includes('name')) return 'string';
    if (lower.includes('email')) return 'email';
    if (lower.includes('phone') || lower.includes('contact')) return 'phone';
    if (lower.includes('address') || lower.includes('city') || lower.includes('country') || lower.includes('street')) return 'address';
    if (lower.includes('company')) return 'company';
    if (lower.includes('date')) return 'date';
    if (lower.includes('id') || lower.includes('uuid')) return 'uuid';
    if (lower.includes('zip') || lower.includes('postal')) return 'zip';
    if (lower.includes('url') || lower.includes('link')) return 'url';
    if (lower.includes('ip')) return 'ip';
    if (lower.includes('password') || lower.includes('pass')) return 'password';
    if (lower.includes('currency') || lower.includes('price') || lower.includes('amount')) return 'currency';
    if (lower.includes('latitude') || lower.includes('lat')) return 'latitude';
    if (lower.includes('longitude') || lower.includes('lng')) return 'longitude';
    if (lower.includes('age') || lower.includes('count') || lower.includes('number')) return 'integer';
    if (lower.startsWith('is') || lower.startsWith('has')) return 'boolean';
    return 'string';
}

function generateFieldValue(fieldName, type, rules = {}, scenario = {}) {
    let value;
    switch (type) {
        case 'string': value = faker.person.fullName(); break;
        case 'email': value = rules.domain ? faker.internet.email().replace(/@.+$/, `@${rules.domain}`) : faker.internet.email(); break;
        case 'phone': value = faker.phone.number(); break;
        case 'company': value = rules.nested ? { name: faker.company.name(), industry: faker.company.industry() } : faker.company.name(); break;
        case 'address': value = rules.nested ? { street: faker.location.streetAddress(), city: faker.location.city(), state: faker.location.state(), country: faker.location.country(), zip: faker.location.zipCode() } : faker.location.streetAddress(); break;
        case 'date':
            if (rules.past) value = faker.date.past().toISOString();
            else if (rules.future) value = faker.date.future().toISOString();
            else value = faker.date.anytime().toISOString();
            break;
        case 'integer':
            const min = rules.min ?? 1;
            const max = rules.max ?? 100;
            value = faker.number.int({ min, max });
            break;
        case 'boolean': value = faker.datatype.boolean(); break;
        case 'uuid': value = faker.string.uuid(); break;
        case 'zip': value = faker.location.zipCode(); break;
        case 'url': value = faker.internet.url(); break;
        case 'ip': value = faker.internet.ip(); break;
        case 'password': value = faker.internet.password(); break;
        case 'currency': value = faker.finance.amount(); break;
        case 'latitude': value = faker.location.latitude(); break;
        case 'longitude': value = faker.location.longitude(); break;
        case 'enum':
            const choices = rules.choices || [];
            value = choices[Math.floor(Math.random() * choices.length)];
            break;
        default: value = faker.word.sample();
    }

    if (scenario.edge_cases) {
        const rand = Math.random();
        if (rand < 0.05) value = null;
        else if (rand < 0.1 && typeof value === 'string') value = '';
        else if (rand < 0.12 && typeof value === 'number') value = -value;
    }

    return value;
}

export const generateTestData = (req, res) => {
    try {
        const task = req.body['results/task'];
        if (!task || !task.fields || !task.count) {
            return res.status(400).json({ status: 'error', message: 'Invalid request: missing fields or count' });
        }

        const { fields, count, existing_data, scenarios = [], rules = {} } = task;
        const generatedData = [];

        for (let i = 0; i < count; i++) {
            const item = {};
            for (const field of fields) {
                let ruleType, ruleOptions = {};
                if (rules[field]) {
                    if (Array.isArray(rules[field])) {
                        ruleType = 'enum';
                        ruleOptions.choices = rules[field];
                    } else if (typeof rules[field] === 'object') {
                        ruleType = rules[field].type || null;
                        ruleOptions = rules[field];
                        // if count is specified => treat as array
                        if (rules[field].count) ruleOptions.isArray = true;
                    }
                }
                const type = detectFieldType(field, ruleType);

                // Handle array fields
                if (ruleOptions.isArray) {
                    const length = ruleOptions.count || faker.number.int({ min: 1, max: 5 });
                    item[field] = Array.from({ length }, () => generateFieldValue(field, type, ruleOptions, { edge_cases: scenarios.includes('edge_cases') }));
                } else {
                    item[field] = generateFieldValue(field, type, ruleOptions, { edge_cases: scenarios.includes('edge_cases') });
                }
            }

            generatedData.push(item);
        }

        const finalData = existing_data ? existing_data.concat(generatedData) : generatedData;

        // Summary statistics
        const stats = {};
        fields.forEach(f => {
            const values = finalData.map(d => d[f]).filter(v => v !== null && v !== undefined);
            if (values.length) {
                if (Array.isArray(values[0])) stats[f] = { count_per_item: values[0].length };
                else if (typeof values[0] === 'number') stats[f] = { min: Math.min(...values), max: Math.max(...values) };
                else if (typeof values[0] === 'string' || typeof values[0] === 'object') stats[f] = { unique: [...new Set(values.map(v => JSON.stringify(v)))].length };
            }
        });

        res.json({
            message_id: req.body.message_id,
            status: 'success',
            generated_data: finalData,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};
