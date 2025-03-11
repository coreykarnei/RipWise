# Building a Free, Lightweight Splitwise Alternative for Shared Expenses

## Introduction

Splitwise is a popular app for simplifying group finances – it lets friends split bills, track shared expenses, and settle balances easily. However, not everyone needs the full suite of social features or cloud sync that Splitwise offers. 

This document outlines a lightweight alternative: a free, offline bill-splitting app focusing only on essential expense tracking. This app requires no backend service or premium account, keeping all data local to the user. The core idea is to let users quickly record who paid for what and calculate who owes whom in a transparent, hassle-free way.

By sticking to basics – adding expenses, computing balances, and editing entries – the app remains private, fast, and easy to use without any unnecessary clutter.

## Core Functionality

Our bill-splitting app centers on fundamental features needed to track shared expenses and settlements. It deliberately avoids extras like friend lists, online payments, or social networking. The core functionality includes:

### Add Transactions
Users can record shared expenses with minimal input – specify who paid, how much, and who participated. Each expense (transaction) is added to a local ledger with details like payer, amount, and a description (e.g. "Dinner" or "Hotel"). By default, the amount is split equally among the selected participants (including the payer, if they're part of the expense share). This makes adding a bill quick and straightforward.

### Automatic Balance Calculation
As transactions are added, the app automatically updates running balances for each person. It calculates how much each person has paid versus how much they owe, maintaining a clear tally of debts. In effect, the app "keeps track of who owes whom and how much," eliminating manual math. Users can always see the net balance for everyone – who should be reimbursed and who needs to pay – based on all entered expenses.

### Edit and Delete Entries
Users can correct mistakes or changes by editing any transaction or deleting it entirely. Updating a transaction (e.g. changing an amount or participants) will immediately recompute balances. This ensures the ledger is flexible and errors can be fixed, giving users control to maintain accurate records. Every expense in the list has options (such as an Edit button or icon) to modify its details or Delete it if added erroneously.

### Local Ledger Storage
All data is stored locally, either in the browser's storage (like LocalStorage or IndexedDB) or a local file, so the app works entirely offline. There's no server or cloud – the ledger lives on the user's device. The chosen storage method persists data between sessions, meaning your recorded expenses remain saved until you clear them. In practice, using LocalStorage means the data is saved on the client's computer and "stays until the user clears the browser's storage". This local ledger approach provides privacy (data never leaves your device) and offline access to your expense records.

### Balance Summary Report (Export)
The app can generate a simple summary of all balances and transactions that the user can export or share. With one click, users can produce a text report listing how much each person owes or is owed, and a breakdown of each recorded expense. This summary can be copied or saved as a file (e.g. a .txt or .csv) to share with others. Modern web APIs even allow the app to create and download a text file directly in the browser – for example, the app might compile the summary string and trigger a download of a file containing the report. This way, everyone involved can review the final balances without needing to use the app themselves.

### Clear Debt Overview
A simple but informative UI will display the current debt situation at a glance. The app provides an overview of who owes money and to whom. For instance, if Alice paid more than her share and Bob paid less, the app might show "Bob owes Alice $X" as part of the summary. All such pairwise debts or each person's net balance are presented clearly. This real-time debt overview spares users from any calculations – the app "automatically computes how much each person owes or is owed based on the expenses" entered. The focus is on clarity: at any moment, users can tell exactly what the outstanding IOUs are.

By keeping just these core features, the app ensures that the essential task – tracking shared expenses and settlements – is done accurately, quickly, and without fuss. Next, we discuss how the user interface is organized to support these features.

## UI Components & Pages

The application's interface is composed of a few simple screens/pages, each dedicated to one of the core tasks. The design is minimal and functional, using basic UI components like lists, tables, and forms. Navigation can be handled with a menu or simple tabs to switch between views (since we have no complex flows). The primary pages and their roles are:

### Home Screen (Transactions & Totals)

This is the main dashboard displaying all recorded expenses and a quick summary of balances. The Home screen acts as the ledger's overview:

- It shows a list of transactions in chronological order (most recent first, for example). Each transaction entry might include the description, amount, who paid, and which participants were involved. For clarity, the entry can also indicate how the amount was split – e.g., "Jane paid $100 for Dinner (split among Jane, John, Bob)". This provides a running transaction history that users can scroll through.

- Alongside the list (perhaps at the top or bottom of the page), the Home screen also displays total balances per user. This could be a small summary section or sidebar listing each person's name and their current balance (positive if others owe them, negative if they owe others, or zero if settled). For example: "Alice: +$20 (others owe Alice $20), Bob: –$20 (Bob owes $20)". This gives an at-a-glance view of the situation for each participant.

- Each transaction item on the list includes options to edit or delete that entry. For instance, selecting a transaction might expand it to show an edit form, or an "Edit" button next to it navigates to the Add Transaction page pre-filled with that data. A "Delete" (trash can icon) removes the expense and updates all balances immediately. This inline editing ability makes it easy to manage the list of expenses.

- The UI is kept simple: likely using a basic table or list for transactions and maybe colored text or badges for balances (e.g., green for positive, red for negative balances) to highlight who should receive or pay money. The overall design of the Home screen is an intuitive ledger view – users see what has been spent and the resulting debts in one place, without any extraneous graphics or social feed.

(The Home Screen is essentially the "dashboard" of the app, showing the expense log and summary balances. From here, the user can navigate to add a new expense or view detailed balances.)

### Add Transaction Page (New Expense Form)

When the user needs to add a new expense, they navigate to the Add Transaction page. This page provides a form to input the details of a shared expense. The form includes:

- A field to select who paid for the expense. This is typically a dropdown list of all users (e.g., Alice, Bob, Charlie, etc.); the user chooses the person who covered the bill. For instance, "Paid by: Jane".

- Input for the amount of the expense (numeric field). This is the total cost that was paid. For example, "Amount: $150.00". There's usually some validation to ensure this is a positive number and maybe formatted to two decimals.

- A text field for a description of the expense (optional but useful for record-keeping). For example, "Description: Groceries" or "Dinner at Luigi's". This helps identify expenses in the list.

- A section to select participants who owe a share of this expense. This can be implemented with a list of checkboxes (one for each user in the group). The user checks off who the expense should be split between. For instance, if the expense was shared by Alice, Bob, and Charlie, all three names are checked. If it was only between two of them, only those two are checked, etc. By default, all active group members could be selected to split an expense equally, but the user can adjust the participants if not everyone was involved. (In our lightweight app, we assume an equal split among the selected participants – no complex percentage or ratio splitting in this basic version.)

- Once the form is filled, an "Add" or "Save" button will submit the new transaction. Upon saving, the app will update the local ledger: internally it will divide the amount equally among the checked participants and credit the payer accordingly. For example, if Jane paid $100 split between Jane and John, the app assigns $50 as John's share owed to Jane. The math and balance updates happen behind the scenes instantly. As noted, if splitting equally, the app can automatically calculate how much each member owes with no further input.

- The UI of this page is minimal and form-based – labels and inputs. It should be clear and quick to use. For instance, the form might resemble: "Who paid? [Jane ▼] What for? [Dinner] Amount [ $ ___ ] Split between [☑ Jack ☑ Jane ☑ John] (Add)".

After adding, the app navigates back to the Home screen (or clears the form for another entry) and the new transaction appears in the list with updated balances. The Add Transaction page ensures adding a bill is a swift process – just a few taps to pick names and enter an amount, mirroring the ease-of-use of Splitwise's "quick add expense" feature.

### Balances Page (Who Owes Whom)

The Balances page provides a detailed breakdown of the net balances and the resolution of debts between users. Whereas the Home screen might show each person's net total, the Balances page answers "who needs to pay whom?" more explicitly:

- The page calculates each user's net position from all transactions: some people will have a positive balance (meaning they paid more than their share and should receive money back) and others a negative balance (they owe money to the group). The Balances page pairs up those net positives and negatives to determine clear repayments.

- A straightforward way to display this is a list of statements like "Alice owes Bob $Y" or "Charlie should pay $X to Dana". The app can derive these from the ledger by comparing how much each person owes or is owed in total. For every person who owes money, there will be a corresponding person who is owed money. The page lists each such debt clearly, avoiding double-counting. For example: if Alice paid for multiple things and Bob owes her $20 total, it will simply show "Bob owes Alice $20." If there are multiple people, it might show Bob owes Alice $20, Charlie owes Bob $5, etc., covering all necessary paybacks.

- If possible, the app can also simplify debts (an optional step) to minimize the number of transactions. However, given our focus on simplicity, we might initially skip the advanced "debt simplification" algorithm. Instead, we can list the raw outcome. In small groups, this is usually easy enough to follow. (For instance, if Alice is owed $20 and Bob owes $20, it's direct; if more complex, a future enhancement could consolidate payments.)

- The Balances page essentially gives a summary that "shows who paid more, who owes money, and the exact amount each person should pay or receive." Each participant's status is crystal clear. It might be formatted as a list or even a simple table: one column for the payer, one for the payee, and the amount between them. Alternatively, sentences or bullet points can be used ("John gives $68.33 to You; John gives $13.34 to Jane" as in the example image).

- There is no built-in payment or "settle up" function in our offline app (unlike Splitwise, which might integrate PayPal or Venmo). Users will settle debts externally (cash or other means). However, the Balances page provides all the info needed to settle – who should pay whom. Once friends pay each other back, they can manually mark those transactions settled by deleting them or simply understand that the balance is cleared. In a basic app, we might not track the act of settling separately (since there's no online account to update), but users can remove or archive transactions once paid if they want.

The Balances page gives the group a definitive answer to "who owes what to whom." It's the key output of all the tracked expenses, so everyone can square up. This page can be shared or shown to all participants so they know what's expected of them.

### Export/Report Page (Sharing the Summary)

While the Balances page shows the results within the app, the Export page or feature allows users to get those results out in a shareable format. The goal is to enable a user to send the summary to their friends (since our app is local, others might not be looking at the same screen).

- The Export feature can be a dedicated page or a simple button that triggers generation of a summary report. This report would include the list of final balances (who owes whom) and optionally the list of all transactions. For example, it might produce a text like:

  ```
  Summary of Expenses:
  Alice is owed $20 in total.
  Bob owes $15 to Alice.
  Charlie owes $5 to Alice.

  Transactions:
  1. Alice paid $30 for Dinner (Alice, Bob, Charlie) – Bob owes $10, Charlie owes $10.
  2. Bob paid $20 for Taxi (Bob, Charlie) – Charlie owes $10.
  ...
  ```

  This is just an illustration – the actual format can be a simple text list or even a CSV table. The key is that it's easy to read and includes all necessary info.

- Generate and Download: The app can use JavaScript to generate this text and then offer it as a file download. For instance, clicking "Export" could create a text blob and automatically download a file like expenses-summary.txt to the user's computer. The ability to create files on the fly in the browser is supported by modern web APIs, so no server is needed. Alternatively, the app might just open a new page with the text that the user can copy and paste into an email or message.

- Share with Group: Once the summary is exported, the user can share that file or text via email or messaging. This ensures everyone involved gets the same information about who owes what. As noted in one guide, "you can share the results with the group, ensuring everyone knows what they owe or are owed." This is exactly the purpose of our Export page.

- If implementing a page for it, the Export Page might simply display the prepared summary on screen and have a "Copy" button and a "Download" button. It's a straightforward, utilitarian page. After using it, the user can return to the Home or Balances page.

Overall, the UI consists of just these few screens. The flow is simple: start at Home to see current status, go to Add Transaction to input a new expense, check Balances to see the outcome, and use Export if you need to share the info. Each page has a clear role, and the design avoids anything superfluous (no pop-ups asking to invite friends, no ads, no profile settings – just the expense data). This simplicity ensures the app is easy to navigate and "intuitive by design", even for non-technical users.

## Technical Approach

To build this lightweight Splitwise alternative, we will use React (a popular front-end JavaScript library) to create a single-page application. React is suitable because it allows us to create a snappy, interactive UI with component-based architecture, all running in the browser. Here are the key technical points and decisions:

### React with Local State
The entire app can be implemented purely on the client side with React. We'll manage the application state (the list of users, transactions, and calculated balances) using React's state and context features. For example, we might keep an array of transactions in a top-level App state or use the Context API to provide the data to all pages. This avoids the need for any backend database – the data lives in memory and in the browser's storage. React's component reactivity means when a transaction is added or edited, the UI will update automatically to reflect new balances.

### LocalStorage for Persistence
To ensure data isn't lost between sessions, we'll utilize Web Storage (specifically localStorage) or a similar mechanism. When the app loads, it will check localStorage for existing expense data (perhaps stored under a key like "expensesData"). If found, we initialize the React state from there. Conversely, whenever the state changes (adding/editing/deleting a transaction), we save the updated state back to localStorage. This provides a simple form of persistence. As noted in web development guides, localStorage allows us to "save data to the client's computer, where it stays until the user clears the browser's storage". This means once a user records expenses, they'll still be there even if they close the app or refresh the page, effectively creating an offline-first experience.

### IndexedDB (optional)
If more complex storage or larger data volumes are needed in the future, we could use IndexedDB (a more powerful browser database) or libraries built on it. For our basic needs, however, localStorage (which can easily handle a moderate number of transactions in JSON format) should suffice. Using localStorage keeps things simple – we just serialize our state to a JSON string. If we anticipate a lot of data or need structured queries, an IndexedDB-based solution or an existing wrapper library could be introduced, but likely not necessary for a small app.

### No Backend / All Frontend
All logic for computing balances is implemented in JavaScript in the browser. For each transaction added, we can recompute the running totals. Alternatively, we maintain running totals incrementally (e.g., when adding a transaction, immediately adjust the involved users' balances in state). The formulas are straightforward: when someone pays an amount that is split among n people, then each of the n participants owes (Amount / n) to the payer (except if the payer is included, the payer effectively owes that share to themselves which does nothing). We accumulate these differences per person to get net balances. We might create a utility function like calculateBalances(transactions) that returns an object mapping each user to how much they owe or are owed. This can be used on the Balances page to derive the pairwise debt relations (who owes whom). Because all of this is done in the browser, the app works offline and there's zero server cost. The trade-off is that the data is only on one user's device – but that is by design for privacy and simplicity.

### Export Implementation
The export functionality can be done using plain browser APIs. For example, we can create a Blob from the summary text and use URL.createObjectURL to create a link that the user can click to download. Another approach is using a library like FileSaver.js for convenience, but it might be overkill – a few lines of vanilla JS can do it. We ensure that the export includes all relevant info (maybe generating it via a function that formats balances and transactions into a string). This technical piece involves string manipulation and using the DOM for downloads or copy-to-clipboard, which are well-supported tasks in modern browsers.

### React Components Structure
We will break the app into reusable components corresponding to our pages (as outlined in the next section). We'll likely use React Router (or a similar approach) to handle navigation between the Home, Add Transaction, Balances, and Export views. Each of those can be a separate component file. We'll also have some smaller components, for example, a TransactionItem component for each entry in the list, or perhaps a BalanceSummary component.

### State Management
For simplicity, we can lift the state up to the App component (which uses useState or useReducer to manage the list of transactions and list of users). We pass down state and setter functions as props to child components. Alternatively, use React's Context to avoid prop drilling – e.g., an ExpensesContext that provides transactions and methods to add/edit/delete. Given the app size, even prop drilling wouldn't be too bad, but context can make it cleaner.

### No External Dependencies
Aside from React (and maybe a UI library if desired for styling), we don't need much else. The app can be created with Create React App or Vite for convenience. We won't need a state management library like Redux since the state is simple, and we won't need a database or network library at all. This keeps the bundle lightweight.

### Offline Capability
Because everything is local, the app will naturally work offline. We could register a Service Worker to make it a Progressive Web App (PWA) that can be installed or cached, but that's optional. Even without an explicit PWA setup, as long as the user has the app open in their browser, it functions without internet. With a bit more work, we can make it a PWA so that it can be launched from a mobile home screen and used on the go – aligning with the goal of a free and private tool.

In summary, the technical approach is to leverage the browser as the runtime and storage. React gives us a dynamic UI, localStorage gives persistence, and no server means zero deployment cost and enhanced privacy. The result is a self-contained web application that embodies the "free, offline, user-controlled" ethos: the user's browser is effectively the entire app environment.

## Required Files & Components

Organizing the project into clear modules will make it easier to develop and maintain. Below is a suggested structure of files (especially for a Create React App or similar setup) and the purpose of each component:

### App.js
The main React component that initializes the app. It can set up the routes for navigation (Home, Add, Balances, Export) and hold the top-level state. For example, App.js might use useState to manage an array of transactions and a list of users (or we can predefine users for simplicity). It provides functions to add/edit/delete transactions which it passes to the relevant pages. It also handles writing to localStorage whenever the transactions state changes (using useEffect). Essentially, App.js ties everything together and renders the navigation menu and the current page.

### Home.js
This component implements the Home Screen. It will read the list of transactions (probably via props or context from App) and the current calculated balances. It maps through the transactions to display each one (could reuse a TransactionItem sub-component). At the top or bottom, it displays the summary of balances per user. It might also include buttons/links to go to the Add Transaction page or Balances page. If using React Router, Home could be a route at '/'. The Home component focuses on presentation: showing a table or list of all transactions and a quick balance overview.

### AddTransaction.js
This component provides the form for adding a new expense (the Add Transaction Page). It contains form state for fields like payer, amount, description, participants (likely using useState or useReducer for the form). On submit, it validates input (e.g., non-empty payer and amount). It then calls a function passed via props (from App) like onAddTransaction(newTransaction) to actually add the transaction to state. After adding, it might navigate back to Home. This component can also be reused for editing an existing transaction: if we pass in an existing transaction as props, the form can populate with those values and on submit call an edit function. Thus, we might allow AddTransaction to handle both "add" and "edit" modes (with slight variations like button label "Save changes" vs "Add expense"). Key elements: dropdown for payer, multi-select (checkboxes) for participants, input for amount, input for description, and a submit button.

### Balances.js
Implements the Balances Page. This component will compute or receive the computed who-owes-whom data. If App already has a utility to calculate balances, it can just pass the structured balances to Balances component. The component then renders a list of debts: e.g., an unordered list of <li>Alice owes Bob $X</li>. If no one owes anything (all settled), it can display a "All settled up!" message. The Balances component purely presents the output of the calculations in a nice format, possibly including each person's net total and the simplified debts. It does not provide interactive elements except maybe a refresh (but if state changes, it will re-render automatically). If we wanted, we could include a button here to trigger "Simplify Debts" (an algorithm that reduces the number of transactions) but again, that's an optional extra for later. In our essential version, we assume the list of pairwise owes is acceptable.

### Export.js
Handles generating the report for sharing. This might not even need to be a separate page; it could be a button on Balances page. But implementing as a component allows showing the formatted summary and giving a download option. The Export component, when rendered, could automatically prepare the summary text (using the current transactions and balances from props). It then shows a textarea or a preformatted text block containing the summary. There could be a "Copy to Clipboard" button (using the Clipboard API) and a "Download" button. The download button can use a bit of JS to create a blob and link, as mentioned. We can also allow choosing a format (maybe JSON export or CSV export), but since the prompt is about a simple text report, we stick to that. This file basically provides the UI for exporting and maybe directly triggers the file download.

### Utility Modules
We can have a utils.js or a helpers.js file containing reusable logic:
- A function like calculateBalances(transactions, users) that returns an object of balances for each user (net owed or owing).
- A function like getDebtPairs(balances) that computes a list of who owes whom based on net balances (matching negatives to positives).
- Functions for saveData and loadData from localStorage, to keep those details out of the components.
- Possibly a unique ID generator for transactions (though we could just use array index or timestamp if needed). These utility functions keep the components cleaner and focus on business logic (expense splitting math, storage abstraction).

### index.js and Others
Standard React entry point (index.js) which renders the App into the DOM. We might also have a basic CSS file (or use inline styles / a CSS framework) since we want a simple but clean look. Styling is minimal: maybe some classes for tables, forms, etc., which can be in an App.css or separate CSS module files.

All files are kept relatively small and focused. For example, Home.js only cares about displaying transactions and balances; it doesn't do math (that could be done in App or a util). AddTransaction.js handles user input, not where data is stored, etc. By separating concerns, another developer (or even an AI) could later take this structure and expand on it, such as adding a new feature or changing storage, without affecting the UI layout code much. This modular structure also aligns with how React apps are typically organized, which would be familiar to many developers.

## Design Principles

In building this app, we adhere to a few design principles to ensure it remains lightweight and user-friendly, truly serving as a streamlined alternative to full-fledged expense apps:

### Focus on Essentials
The app includes only the features necessary for splitting bills. Each feature from the core functionality list serves a direct purpose in tracking or settling expenses. We intentionally avoid anything beyond that scope. For example, we do not include user profiles, friends list, or activity feeds. While major apps have a long list of features (from user authentication and notifications to OCR scanning of receipts), our design omits all non-essentials. This means no sign-up/login (since data is local, anyone using the app can just start adding expenses), no social features like comments or likes, no integrations with bank accounts or payments. By saying "no" to feature creep, we keep the interface simple and the user focused on the task of splitting expenses.

### Privacy and Offline Use
All data stays with the user. There's a growing concern for privacy and control over personal expense data – our app addresses that by not sending anything to a server. It works completely offline and does not require an internet connection after you download it. This also makes it fast (no loading delays) and available anywhere (even on a trip with no cell service). The local storage ledger approach is "secure and hassle-free" since the user isn't trusting a third-party with sensitive financial info. In practice, this means one person might use the app to track a group's expenses, and others trust that person's device, which is fine for close friends/family scenarios.

### Clarity and Simplicity of UI
The interface should at a glance tell the story of the expenses. Using clear labels like "owes" and "paid by," simple tables, and perhaps light background highlights for positive/negative balances, we make the data easy to parse. Each page is uncluttered – for example, the Balances page only lists balances (and maybe a total summary), nothing else. We favor text and basic icons over complex graphs or animations. The design follows standard UI conventions (e.g., a plus ➕ button for adding, a trash icon for delete) so users find it intuitive. An "intuitive design that simplifies navigation" is a core requirement. We also ensure it's responsive (since being a web app, users might open it on mobile browsers) – using simple CSS or flexible layouts so that it looks okay on a phone screen as well as a desktop.

### No Cost, No Strings
This app is completely free to use. There are no premium tiers, no ads, and no prompts to "upgrade" for more features. The goal is to replicate the essential utility of bill splitting without monetization barriers. Many popular apps eventually try to monetize via subscriptions or ads, but a simple tool like this thrives by being a utility that users can trust and keep using long-term without frustration. "No registration, no password, totally free" – as the tagline of another expense tool puts it, and that sentiment applies here as well. The user doesn't even provide an email – the app is as anonymous as a calculator.

### Shareability
Even without a backend, we design for the fact that multiple people are involved in the expenses. The export/share feature is crucial so that one person's local data can be communicated to others. The app's output (who owes whom) is as important as the input. By making it easy to export and share the summary, we compensate for the lack of a cloud sync. In essence, one person acts as the "accountant" and then shares results, or each person could independently use the app and compare notes. The design ensures that the summary is understandable by others even out of context (hence including the list of transactions in the report can help others verify the splits). This addresses transparency – "everybody can understand what they owe and why", which avoids potential conflicts.

### Extensibility (Future-Proofing)
While the first version is minimal, we keep the code structure flexible for future enhancements. For example, if later we wanted to add a "simplify debts" button or allow custom split ratios, the logic can be added in the calculation utilities without overhauling the whole app. Or if we decide to add a cloud sync as an optional feature, we could do so in a modular way (keeping local as default). The design principle here is to create a solid MVP (Minimum Viable Product) for bill splitting, but not paint ourselves into a corner for future improvements. However, any new feature must justify itself against the simplicity goal.

## Conclusion

This project is guided by the goal of making bill splitting as simple as possible. It should feel like a modern equivalent of pen-and-paper ledger or a basic spreadsheet – but more convenient. The app "expedites the process, allowing you to promptly determine who owes what without inconvenience". 

By sticking to core functionality, designing a clean UI, and keeping everything local and free, we provide users with an essential tool: no more, no less. This document can now be used to guide development or even feed into an AI to generate a mock UI, as it clearly delineates each screen and feature needed for a lightweight expense-splitting app.