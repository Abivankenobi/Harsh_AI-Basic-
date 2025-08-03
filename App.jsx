import { useState, useEffect } from 'react';
// We will remove the import for 'next/head' as it's not available in this environment
// and causing a compilation error.

// We'll simulate the data being fetched from the uploaded files here.
// In a real application, this might be a static file or an API endpoint.

const employeeDataCSV = `Employee Name,Department,Band,Base Salary (INR),Performance Bonus (INR),Retention Bonus (INR),Total CTC (INR),Location,Joining Date
Martha Bennett,Sales,L1,411477,60657,22227,494361,Aimeebury,2025-05-02
Christopher Higgins,HR,L3,1405700,178939,95532,1680171,New Amanda,2025-05-12
Tiffany Bradshaw,Operations,L5,3268457,362085,148926,3779468,East Christine,2025-05-21
Julie Rodriguez,Engineering,L5,3773988,298036,263748,4335772,Fernandezberg,2025-08-12
Emily Brown,Operations,L4,2315702,285620,133898,2735220,Smithside,2025-07-09
Samantha Taylor,Engineering,L5,3463331,349130,222375,4034836,Suehaven,2025-05-06
Diane Baker,Engineering,L2,804117,62251,44807,911175,South Shelbytown,2025-07-16
Glen Boyd,Operations,L1,446753,43630,20218,510601,Masseyfort,202`;

const leavePolicyPDF = `
--- PAGE 1 ---
Company ABC - Leave & Work from Office (WFO) Policy
Version: July 2025
Applies to: All Full-Time Employees (Bands L1 to L5, across all teams)

1. Purpose & Philosophy
Company ABC believes that employee well-being is foundational to high performance. This
policy is designed to provide employees with clarity on:
- Leave entitlements and types
- Guidelines for applying, tracking, and managing leaves
- Expectations on work from office (WFO) across functions
- Hybrid flexibility and behavioral norms while remote

2. Band-wise Leave Entitlement Matrix
"Band","Total Leave Days","Earned Leave","Sick Leave","Casual Leave","WFH Eligibility","WFO Minimum Days"
"L1","12","6","4","2","Limited","4/week"
"L2","15","8","5","2","Partial","3-4/week"
"L3","18","10","6","2","Yes","3/week"
"L4","20","12","6","2","Yes","2-3/week"
"L5","Unlimited (with approval)","NA","NA","NA","Full Flex","0-2/week (optional)"

3. Types of Leave Explained
Earned Leave (EL): Planned leave for personal travel, family time, or rest. Must be applied ≥3 working days in advance.
Sick Leave (SL): For illness or medical emergencies. Can be taken without prior approval. Medical certificate needed if >2 days.
Casual Leave (CL): For unforeseen situations (e.g., urgent home repairs, school events). Capped at 2 consecutive days.
...
4. Leave Application Process
...
5. Work From Office (WFO) Expectations by Team
"Team","Minimum WFO Days","WFO Days Suggested","Remote Work Notes"
"Engineering","3/week","Mon, Tue, Thu","Sprint reviews must be in-office"
"Sales","4-5/week","Field visits + office","Remote only with RSM approval"
"HR","4/week","Mon-Thu","In-office mandatory during onboarding"
"Finance","3/week","Tue, Wed, Fri","Fully in-office during month-end"
"Ops/Support","5/week","All weekdays","WFH not permitted except in emergencies"
...
`;

const travelPolicyPDF = `
--- PAGE 1 ---
Company ABC – HR Travel Policy
Version: July 2025
Applies To: All Full-Time Employees (Bands L1 to L5)

1. Introduction & Scope
Company ABC values purposeful, efficient, and safe business travel. This policy outlines the
rules, processes, and entitlements governing domestic and international travel
undertaken by employees for business purposes, including client meetings, conferences,
offsites, and inter-office collaboration.

2. Travel Eligibility & Entitlements (Band-wise)
2.1 Travel Band Matrix
"Band","Travel Mode (Domestic)","International Eligibility","Flight Class","Hotel Cap/Night","Per Diem (Domestic)","Per Diem (Intl)","Approval Required"
"L1","Train 2AC / Bus","VP approval only","Economy (on approval)","Rs. 2,000","Rs. 1,500","USD 30","Manager + VP"
"L2","Economy flight if $>6$ hrs","Director approval","Economy","Rs. 3,000","Rs. 2,000","USD 40","Manager + Director"
"L3","Economy standard","Permitted","Economy","Rs. 4,000","Rs. 3,000","USD 60","Reporting Manager"
"L4","Premium economy (justified)","Standard","Business Economy","Rs. 6,000","Rs. 4,500","USD 80","VP"
"L5","Business class","Standard","Business","Rs. 10,000","Rs. 7,500","USD 120","None"
...
3. Booking Process
...
4. Reimbursements
...
`;

const offerLetterTemplatePDF = `
--- PAGE 1 ---
Offer Letter - Company ABC
Date: July 28, 2025
Candidate Name: Jane Doe
Position: Software Engineer
Band Level: L3
Location: Bangalore
Joining Date: August 12, 2025

1. Appointment Details
We are delighted to offer you the position of Software Engineer in the Engineering team at
Company ABC. This is a full-time role based out of our Bangalore office. Your employment
will be governed by the terms outlined in this letter and the Employee Handbook.

2. Compensation Structure
"Component","Annual (INR)"
"Fixed Salary","15,00,000"
"Performance Bonus (10%)","1,50,000"
"Retention Bonus (2 Years)","1,00,000"
"Total CTC","17,50,000"

3. Leave Entitlements (Band L3)
You are entitled to 18 days of paid leave annually, structured as follows:
Earned Leave: 10 days
Sick Leave: 6 days
Casual Leave: 2 days
Leave resets each January. Carry-forward is allowed up to 10 days. All leaves must be
applied via HRMS with manager approval.

4. Work From Office Policy (Engineering Team)
You are expected to follow a hybrid working model with a minimum of 3 days/week in
office (suggested: Monday, Tuesday, Thursday). Exceptions for full-remote during sprints
may be approved by your manager.

You are eligible for:
- Rs. 1,000/month internet reimbursement
- One-time Rs. 5,000 home-office setup support

5. Travel Policy (Band L3)
You will be eligible for official travel as per Band L3 norms:
Domestic Travel: Economy flights standard
International Travel: Allowed for conferences and client meetings
Hotel Cap: Rs. 4,000/night
Per Diem: Rs. 3,000/day (domestic), USD 60/day (international)
All travel must be approved by your reporting manager and booked via the designated
platform.

6. Confidentiality & IP Clause
You are expected to maintain strict confidentiality of all proprietary data, financials,
codebases, and client information. All work products created during employment shall
remain the intellectual property of Company ABC.

7. Termination & Exit
Either party may terminate the employment with 60 days' notice
During probation (first 3 months), a 15-day notice period applies
All company property and access must be returned on final working day

8. Next Steps
Please confirm your acceptance of this offer by signing and returning this letter via
DocuSign within 5 working days.
`;

// Helper function to parse CSV text into a JSON array
const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  const employees = lines.slice(1).map(line => {
    const values = line.split(',');
    const employee = {};
    headers.forEach((header, i) => {
      employee[header] = values[i].trim();
    });
    return employee;
  });
  return employees;
};

// Helper function to parse policy documents and chunk them
const parsePolicy = (policyText, policyType) => {
  // A simple chunking strategy: split by section headers
  const sections = policyText.split(/\n\n[0-9]+\. /);
  return sections.map(section => {
    const chunkId = `${policyType}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      id: chunkId,
      source: policyType,
      text: section.trim(),
    };
  });
};

// A simple Markdown to HTML converter to properly render the output
const markdownToHtml = (markdown) => {
  let html = markdown;

  // Convert headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

  // Convert bold and italics
  html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*)\*/gim, '<em>$1</em>');

  // Convert lists
  html = html.replace(/^\s*\-\s(.*$)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');

  // Convert new lines to <br>
  html = html.replace(/\n/gim, '<br />');

  return html;
};

export default function App() {
  const [employeeName, setEmployeeName] = useState('');
  const [offerLetter, setOfferLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [leavePolicyChunks, setLeavePolicyChunks] = useState([]);
  const [travelPolicyChunks, setTravelPolicyChunks] = useState([]);

  useEffect(() => {
    // Parse the static data once on component mount
    setEmployees(parseCSV(employeeDataCSV));
    setLeavePolicyChunks(parsePolicy(leavePolicyPDF, 'leave-policy'));
    setTravelPolicyChunks(parsePolicy(travelPolicyPDF, 'travel-policy'));
  }, []);

  const findRelevantPolicies = (band, department) => {
    // A simple retrieval strategy: find chunks that mention the specific band and department.
    // In a real RAG system, this would involve vector similarity search.
    const relevantLeavePolicies = leavePolicyChunks
      .filter(chunk => chunk.text.includes(band) || chunk.text.includes(department))
      .map(chunk => chunk.text)
      .join('\n\n---\n\n');

    const relevantTravelPolicies = travelPolicyChunks
      .filter(chunk => chunk.text.includes(band) || chunk.text.includes(department))
      .map(chunk => chunk.text)
      .join('\n\n---\n\n');

    return { relevantLeavePolicies, relevantTravelPolicies };
  };

  const generateOfferLetter = async (employeeDetails) => {
    setLoading(true);
    setOfferLetter('');

    try {
      // Find the specific policies for the employee's band and department
      const { relevantLeavePolicies, relevantTravelPolicies } = findRelevantPolicies(
        employeeDetails['Band'],
        employeeDetails['Department']
      );

      const prompt = `
        You are an HR agent. Your task is to generate a personalized offer letter for a new employee based on a provided template and relevant HR policies.
        
        Use the following employee details:
        - Employee Name: ${employeeDetails['Employee Name']}
        - Position: ${employeeDetails['Department']}
        - Band Level: ${employeeDetails['Band']}
        - Location: ${employeeDetails['Location']}
        - Joining Date: ${employeeDetails['Joining Date']}
        
        Use the following compensation structure:
        - Fixed Salary: ${employeeDetails['Base Salary (INR)']}
        - Performance Bonus: ${employeeDetails['Performance Bonus (INR)']}
        - Retention Bonus: ${employeeDetails['Retention Bonus (INR)']}
        - Total CTC: ${employeeDetails['Total CTC (INR)']}

        Use the following HR policies to fill in the relevant sections of the offer letter. Only include the information that is directly applicable to the employee's band and department.

        --- START OF LEAVE POLICY ---
        ${relevantLeavePolicies}
        --- END OF LEAVE POLICY ---

        --- START OF TRAVEL POLICY ---
        ${relevantTravelPolicies}
        --- END OF TRAVEL POLICY ---

        Here is a sample offer letter template. Adapt it to the new employee's details and policies.
        
        --- START OF TEMPLATE ---
        ${offerLetterTemplatePDF}
        --- END OF TEMPLATE ---
        
        Your final output must be a complete offer letter in Markdown format. Ensure the tone is professional and welcoming.
        Do not include the policy source content in the final output, only the summarized points.
      `;

      const chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
      }

      const result = await response.json();
      if (result.candidates && result.candidates.length > 0 &&
        result.candidates[0].content && result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setOfferLetter(text);
      } else {
        setOfferLetter("An error occurred while generating the offer letter. The response was empty or malformed.");
      }
    } catch (error) {
      console.error("Error generating offer letter:", error);
      setOfferLetter(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const employeeDetails = employees.find(
      (emp) => emp['Employee Name'].toLowerCase() === employeeName.toLowerCase()
    );

    if (employeeDetails) {
      generateOfferLetter(employeeDetails);
    } else {
      setOfferLetter(`Employee '${employeeName}' not found. Please try one of the following names: ${employees.map(e => e['Employee Name']).join(', ')}.`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <title>Offer Letter Agent</title>

      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Offer Letter Generation Agent
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Panel: Chat UI */}
          <div className="w-full md:w-1/3 flex flex-col bg-gray-50 p-4 rounded-xl shadow-inner">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Chat with the Agent</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label htmlFor="employee-name" className="text-sm font-medium text-gray-700">
                Enter Employee Name:
              </label>
              <input
                id="employee-name"
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="e.g., Jane Doe"
                className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Generating...' : 'Generate Offer Letter'}
              </button>
            </form>
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                    Try one of these names from the list:
                </p>
                <ul className="list-disc list-inside mt-2 text-sm text-gray-500">
                    <li>Martha Bennett</li>
                    <li>Christopher Higgins</li>
                    <li>Tiffany Bradshaw</li>
                    <li>Julie Rodriguez</li>
                    <li>Emily Brown</li>
                    <li>Samantha Taylor</li>
                    <li>Diane Baker</li>
                    <li>Glen Boyd</li>
                </ul>
            </div>
          </div>

          {/* Right Panel: Offer Letter Display */}
          <div className="w-full md:w-2/3 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Generated Offer Letter</h2>
            <div className="flex-grow p-6 bg-white border border-gray-200 rounded-xl shadow-inner overflow-y-auto" style={{ minHeight: '500px' }}>
              {loading && (
                <div className="flex justify-center items-center h-full text-blue-600">
                  <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-lg">Generating offer letter...</span>
                </div>
              )}
              {offerLetter && (
                <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: markdownToHtml(offerLetter) }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
