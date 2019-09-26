So, you want to create a new audit? Great! We're excited that you want to add to the Lighthouse project :) The goal of this 
document is to help you understand what constitutes as a "good" audit for Lighthouse, and steps you can follow if you want
to propose a new audit. 

## New audit principles
Lighthouse audits that surface in the report should be: 
- Applicable to a significant portion of web developers (based on scale and severity of impact) 
- Contribute significantly towards making the mobile web experience better for end users. 
- Not have a significant impact on our runtime performance or bundle size. 
- Something that is new, and not something that is already measured by existing audits. 
- Important for our strategic goals as a product.
- Measurable (especially for performance audits) or have clear pass/fail states. 
- Not use 3rd party APIs for completing the audit check. 


## Process for creating a new audit
1. Briefly scan the criteria we’ve laid out above. If you think the principles match with your proposed new audit, then proceed! 
2. Next step is to create an issue on GitHub with answers to the following questions: 
```
#### Provide a basic description of the audit
#### How would the audit appear in the report? 
<!-- How would the test look when passing? Would there be additional details available?
     How would the test look when failing? What additional details are available? 
     If the details are tabular, what are the columns?
     If not obvious, how would passing/failing be defined? -->
#### How is this audit different from existing ones?
#### What % of developers/pages will this impact? 
<!-- (Estimates OK, data points preferred) -->
#### How is the new audit making a better web for end users?
<!-- (Data points preferred) -->
#### What is the resourcing situation? 
<!-- Who will create the audits, write the documentation, and maintain both? -->
#### Any other links or documentation that we should check out?
```
3. Once the proposal is submitted, then Lighthouse team will take a look and followup. We will discuss possible implementation approaches, and associated runtime overhead.
With this new information we can better understand the impl cost and effort required and prioritize the audit into our sprint/roadmap. 
4. Depending on the prioritization, we'll then work with you to figure out the necessary engineering/UX/product details. 
