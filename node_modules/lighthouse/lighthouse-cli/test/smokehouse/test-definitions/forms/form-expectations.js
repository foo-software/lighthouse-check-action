/**
 * @license Copyright 2020 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/**
 * @type {Array<Smokehouse.ExpectedRunnerResult>}
 * Expected Lighthouse artifacts from Form gatherer
 */
const expectations = [
  {
    artifacts: {
      FormElements: [
        {
          attributes: {
            id: 'checkout',
            name: 'checkout',
            autocomplete: 'on',
          },
          inputs: [
            {
              id: 'name_cc1',
              name: 'name_cc1',
              placeholder: 'John Doe',
              autocomplete: {
                property: '',
                attribute: 'sectio-red shipping cc-namez',
                prediction: 'UNKNOWN_TYPE',
              },
              node: {
                nodeLabel: 'textarea',
                snippet:
                '<textarea type="text" id="name_cc1" name="name_cc1" autocomplete="sectio-red shipping cc-namez" placeholder="John Doe">',
              }},
            {
              id: 'CCNo1',
              name: 'CCNo1',
              placeholder: '5555 5555 5555 5555',
              autocomplete: {
                property: 'cc-number',
                attribute: 'cc-number',
                prediction: 'HTML_TYPE_CREDIT_CARD_NUMBER',
              },
              node: {
                nodeLabel: 'input',
                snippet:
                '<input type="text" id="CCNo1" name="CCNo1" autocomplete="cc-number" placeholder="5555 5555 5555 5555">',
              }},
            {
              id: 'CCExpiresMonth1',
              name: 'CCExpiresMonth1',
              autocomplete: {
                property: 'cc-exp-month',
                attribute: 'cc-exp-month',
                prediction: 'HTML_TYPE_CREDIT_CARD_EXP_MONTH',
              },
              node: {
                nodeLabel: 'MM\n01\n02\n03\n04\n05\n06\n07\n08\n09\n10\n11\n12',
                snippet:
                '<select id="CCExpiresMonth1" name="CCExpiresMonth1" autocomplete="cc-exp-month">'},
            },
            {
              id: 'CCExpiresYear1',
              name: '',
              autocomplete: {
                property: 'section-red billing cc-exp-year',
                attribute: 'section-red billing cc-exp-year',
                prediction: 'HTML_TYPE_CREDIT_CARD_EXP_YEAR',
              },
              node: {
                nodeLabel: 'YY\n2019\n2020\n2021\n2022\n2023\n2024\n2025\n2026\n2027\n2028\n2029',
                snippet:
                '<select id="CCExpiresYear1" autocomplete="section-red billing cc-exp-year">',
              }},
            {
              id: 'cvc1',
              name: 'cvc1',
              placeholder: '555',
              autocomplete: {
                property: 'cc-csc',
                attribute: 'cc-csc',
                prediction: 'HTML_TYPE_CREDIT_CARD_VERIFICATION_CODE',
              },
              node: {
                nodeLabel: 'input',
                snippet: '<input id="cvc1" name="cvc1" autocomplete="cc-csc" placeholder="555">'},
            },
          ],
          labels: [
            {
              for: 'name_cc1',
              node: {
                nodeLabel: 'Name on card:',
                snippet: '<label for="name_cc1">'},
            },
            {
              for: 'CCNo1',
              node: {
                nodeLabel: 'Credit card number:',
                snippet: '<label for="CCNo1">'},
            },
            {
              for: 'CCExpiresMonth1',
              node: {
                nodeLabel: 'Expiry Date:',
                snippet: '<label for="CCExpiresMonth1">',
              },
            },
            {
              for: 'cvc1',
              node: {
                nodeLabel: 'CVC:',
                snippet: '<label for="cvc1">',
              },
            },
          ],
          node: {
            nodeLabel:
            'Name on card: \nCredit card number: \nExpiry Date: \nMM\n01\n02\n03\n04\n05\n06\n07\n08\n09…',
            snippet: '<form id="checkout" name="checkout" action="../done.html" method="post">',
          },
        },
        {
          inputs: [
            {
              id: 'name_shipping',
              name: '',
              placeholder: 'John Doe',
              autocomplete: {
                property: 'name',
                attribute: 'name',
                prediction: 'HTML_TYPE_NAME',
              },
              node: {
                nodeLabel: 'input',
                snippet:
                '<input type="text" id="name_shipping" autocomplete="name" placeholder="John Doe">',
              }},
            {
              id: 'address_shipping',
              name: '',
              placeholder: 'Your address',
              autocomplete: {
                property: '',
                attribute: 'shippin street-address',
                prediction: 'ADDRESS_HOME_LINE1',
              },
              node: {
                nodeLabel: 'input',
                snippet:
                '<input type="text" id="address_shipping" autocomplete="shippin street-address" placeholder="Your address">',
              }},
            {
              id: 'city_shipping',
              name: '',
              placeholder: 'city you live',
              autocomplete: {
                property: '',
                attribute: 'mobile section-red shipping address-level2',
                prediction: 'ADDRESS_HOME_CITY',
              },
              node: {
                nodeLabel: 'input',
                snippet:
                '<input type="text" id="city_shipping" placeholder="city you live" autocomplete="mobile section-red shipping address-level2">',
              }},
            {
              id: 'state_shipping',
              name: '',
              autocomplete: {
                property: '',
                attribute: null,
                prediction: 'ADDRESS_HOME_STATE',
              },
              node: {
                nodeLabel: 'Select a state\nCA\nMA\nNY\nMD\nOR\nOH\nIL\nDC',
                snippet: '<select id="state_shipping">'},
            },
            {
              id: 'zip_shipping',
              name: '',
              placeholder: '',
              autocomplete: {
                property: '',
                attribute: null,
                prediction: 'ADDRESS_HOME_ZIP',
              },
              node: {
                nodeLabel: 'input',
                snippet: '<input type="text" id="zip_shipping">'},
            },
            {
              id: 'name_billing',
              name: 'name_billing',
              placeholder: 'your name',
              autocomplete: {
                property: '',
                attribute: 'sectio-red billing name',
                prediction: 'NAME_FULL',
              },
              node: {
                nodeLabel: 'input',
                snippet:
                '<input type="text" id="name_billing" name="name_billing" placeholder="your name" autocomplete="sectio-red billing name">',
              }},
            {
              id: 'address_billing',
              name: 'address_billing',
              placeholder: 'your address',
              autocomplete: {
                property: 'billing street-address',
                attribute: 'billing street-address',
                prediction: 'HTML_TYPE_STREET_ADDRESS',
              },
              node: {
                nodeLabel: 'input',
                snippet:
                '<input type="text" id="address_billing" name="address_billing" autocomplete="billing street-address" placeholder="your address">',
              }},
            {
              id: 'city_billing',
              name: 'city_billing',
              placeholder: 'city you live in',
              autocomplete: {
                property: '',
                attribute: 'section-red shipping ',
                prediction: 'UNKNOWN_TYPE',
              },
              node: {
                nodeLabel: 'input',
                snippet:
                '<input type="text" id="city_billing" name="city_billing" placeholder="city you live in" autocomplete="section-red shipping ">',
              }},
            {
              id: 'state_billing',
              name: 'state_billing',
              autocomplete: {
                property: '',
                attribute: null,
                prediction: 'ADDRESS_HOME_STATE',
              },
              node: {
                nodeLabel:
                '\n            Select a state\n            CA\n            MA\n            NY\n      …',
                snippet: '<select id="state_billing" name="state_billing">',
              }},
            {
              id: 'zip_billing',
              name: '',
              placeholder: '',
              autocomplete: {
                property: '',
                attribute: null,
                prediction: 'ADDRESS_HOME_ZIP',
              },
              node: {
                nodeLabel: 'input',
                snippet: '<input type="text" id="zip_billing">',
              }},
            {
              id: 'name_cc2',
              name: 'name_cc2',
              placeholder: '',
              autocomplete: {
                property: 'cc-name',
                attribute: 'cc-name',
                prediction: 'HTML_TYPE_CREDIT_CARD_NAME_FULL',
              },
              node: {
                nodeLabel: 'textarea',
                snippet:
                '<textarea type="text" id="name_cc2" name="name_cc2" autocomplete="cc-name">',
              }},
            {
              id: 'CCNo2',
              name: 'CCNo2',
              placeholder: '',
              autocomplete: {
                property: 'section-red cc-number',
                attribute: 'section-red cc-number',
                prediction: 'HTML_TYPE_CREDIT_CARD_NUMBER',
              },
              node: {
                nodeLabel: 'input',
                snippet:
                '<input type="text" id="CCNo2" name="CCNo2" autocomplete="section-red cc-number">',
              }},
            {
              id: 'CCExpiresMonth2',
              name: 'CCExpiresMonth2',
              autocomplete: {
                property: '',
                attribute: null,
                prediction: 'CREDIT_CARD_EXP_MONTH',
              },
              node: {
                nodeLabel: 'MM\n01\n02\n03\n04\n05\n06\n07\n08\n09\n10\n11\n12',
                snippet: '<select id="CCExpiresMonth2" name="CCExpiresMonth2">',
              }},
            {
              id: 'CCExpiresYear',
              name: '',
              autocomplete: {
                property: '',
                attribute: null,
                prediction: 'CREDIT_CARD_EXP_4_DIGIT_YEAR',
              },
              node: {
                nodeLabel: 'YY\n2019\n2020\n2021\n2022\n2023\n2024\n2025\n2026\n2027\n2028\n2029',
                snippet: '<select id="CCExpiresYear">'},
            },
            {
              id: 'cvc2',
              name: 'cvc2',
              placeholder: '',
              autocomplete: {
                property: 'cc-csc',
                attribute: 'cc-csc',
                prediction: 'HTML_TYPE_CREDIT_CARD_VERIFICATION_CODE',
              },
              node: {
                nodeLabel: 'input',
                snippet: '<input id="cvc2" name="cvc2" autocomplete="cc-csc">',
              }},
            {
              id: 'mobile-number',
              name: 'mobile-number',
              placeholder: '',
              autocomplete: {
                property: 'section-red shipping mobile tel',
                attribute: 'section-red shipping mobile tel',
                prediction: 'HTML_TYPE_TEL',
              },
              node: {
                nodeLabel: 'input',
                snippet:
                '<input type="text" name="mobile-number" id="mobile-number" autocomplete="section-red shipping mobile tel">',
              }},
            {
              id: 'random',
              name: 'random',
              placeholder: '',
              autocomplete: {
                property: '',
                attribute: null,
                prediction: 'UNKNOWN_TYPE',
              },
              node: {
                nodeLabel: 'input',
                snippet: '<input type="text" name="random" id="random">'},
            },
          ],
          labels: [
            {
              for: 'name_shipping',
              node: {
                nodeLabel: 'Name:',
                snippet: '<label for="name_shipping">'},
            },
            {
              for: 'address_shipping',
              node: {
                nodeLabel: 'Address:',
                snippet: '<label for="address_shipping">'},
            },
            {
              for: 'city_shipping',
              node: {
                nodeLabel: 'City:',
                snippet: '<label for="city_shipping">'},
            },
            {
              for: 'Sstate_shipping',
              node: {
                nodeLabel: 'State:',
                snippet: '<label for="Sstate_shipping">'},
            },
            {
              for: 'zip_shipping',
              node: {
                nodeLabel: 'Zip:',
                snippet: '<label for="zip_shipping">'},
            },
            {
              for: 'name_billing',
              node: {
                nodeLabel: 'Name:',
                snippet: '<label for="name_billing">'},
            },
            {
              for: 'address_billing',
              node: {
                nodeLabel: 'Address:',
                snippet: '<label for="address_billing">'},
            },
            {
              for: 'city_billing',
              node: {
                nodeLabel: 'City:',
                snippet: '<label for="city_billing">'},
            },
            {
              for: 'state_billing',
              node: {
                nodeLabel: 'State:',
                snippet: '<label for="state_billing">'},
            },
            {
              for: 'zip_billing',
              node: {
                nodeLabel: 'Zip:',
                snippet: '<label for="zip_billing">'},
            },
            {
              for: 'name_cc2',
              node: {
                nodeLabel: 'Name on card:',
                snippet: '<label for="name_cc2">'},
            },
            {
              for: 'CCNo2',
              node: {
                nodeLabel: 'Credit card number:',
                snippet: '<label for="CCNo2">'},
            },
            {
              for: 'CCExpiresMonth2',
              node: {
                nodeLabel: 'Expiry Date:',
                snippet: '<label for="CCExpiresMonth2">'},
            },
            {
              for: 'cvc2',
              node: {
                nodeLabel: 'CVC:',
                snippet: '<label for="cvc2">'},
            },
            {
              for: 'mobile-number',
              node: {
                nodeLabel: 'Mobile phone Number:',
                snippet: '<label for="mobile-number">'},
            },
            {
              for: 'random',
              node: {
                nodeLabel: 'Random Page Input:',
                snippet: '<label for="random">'},
            },
          ],
        },
      ],
    },
    lhr: {
      requestedUrl: 'http://localhost:10200/form.html',
      finalUrl: 'http://localhost:10200/form.html',
      audits: {
        autocomplete: {
          score: 0,
          warnings: [
            '`autocomplete` token(s): "sectio-red shipping cc-namez" is invalid in <textarea type="text" id="name_cc1" name="name_cc1" autocomplete="sectio-red shipping cc-namez" placeholder="John Doe">',
            '`autocomplete` token(s): "shippin street-address" is invalid in <input type="text" id="address_shipping" autocomplete="shippin street-address" placeholder="Your address">',
            '`autocomplete` token(s): "mobile section-red shipping address-level2" is invalid in <input type="text" id="city_shipping" placeholder="city you live" autocomplete="mobile section-red shipping address-level2">',
            'Review order of tokens: "mobile section-red shipping address-level2" in <input type="text" id="city_shipping" placeholder="city you live" autocomplete="mobile section-red shipping address-level2">',
            '`autocomplete` token(s): "sectio-red billing name" is invalid in <input type="text" id="name_billing" name="name_billing" placeholder="your name" autocomplete="sectio-red billing name">',
            '`autocomplete` token(s): "section-red shipping " is invalid in <input type="text" id="city_billing" name="city_billing" placeholder="city you live in" autocomplete="section-red shipping ">',
          ],
          details: {
            items: [
              {
                node: {
                  type: 'node',
                  snippet:
                    '<textarea type="text" id="name_cc1" name="name_cc1" autocomplete="sectio-red shipping cc-namez" placeholder="John Doe">',
                  nodeLabel: 'textarea',
                },
                suggestion: 'Requires manual review',
                current: 'sectio-red shipping cc-namez',
              },
              {
                node: {
                  type: 'node',
                  snippet:
                    '<input type="text" id="address_shipping" autocomplete="shippin street-address" placeholder="Your address">',
                  nodeLabel: 'input',
                },
                suggestion: 'address-line1',
                current: 'shippin street-address',
              },
              {
                node: {
                  type: 'node',
                  snippet:
                    '<input type="text" id="city_shipping" placeholder="city you live" autocomplete="mobile section-red shipping address-level2">',
                  nodeLabel: 'input',
                },
                suggestion: 'Review order of tokens',
                current: 'mobile section-red shipping address-level2',
              },
              {
                node: {
                  type: 'node',
                  snippet: '<select id="state_shipping">',
                  nodeLabel: 'Select a state\nCA\nMA\nNY\nMD\nOR\nOH\nIL\nDC',
                },
                suggestion: 'address-level1',
                current: '',
              },
              {
                node: {
                  type: 'node',
                  snippet: '<input type="text" id="zip_shipping">',
                  nodeLabel: 'input',
                },
                suggestion: 'postal-code',
                current: '',
              },
              {
                node: {
                  type: 'node',
                  snippet:
                    '<input type="text" id="name_billing" name="name_billing" placeholder="your name" autocomplete="sectio-red billing name">',
                  nodeLabel: 'input',
                },
                suggestion: 'name',
                current: 'sectio-red billing name',
              },
              {
                node: {
                  type: 'node',
                  snippet:
                    '<input type="text" id="city_billing" name="city_billing" placeholder="city you live in" autocomplete="section-red shipping ">',
                  nodeLabel: 'input',
                },
                suggestion: 'Requires manual review',
                current: 'section-red shipping ',
              },
              {
                node: {
                  type: 'node',
                  snippet: '<select id="state_billing" name="state_billing">',
                  nodeLabel:
                    '\n            Select a state\n            CA\n            MA\n            NY\n      …',
                },
                suggestion: 'address-level1',
                current: '',
              },
              {
                node: {
                  type: 'node',
                  snippet: '<input type="text" id="zip_billing">',
                  nodeLabel: 'input',
                },
                suggestion: 'postal-code',
                current: '',
              },
              {
                node: {
                  type: 'node',
                  snippet: '<select id="CCExpiresMonth2" name="CCExpiresMonth2">',
                  nodeLabel: 'MM\n01\n02\n03\n04\n05\n06\n07\n08\n09\n10\n11\n12',
                },
                suggestion: 'cc-exp-month',
                current: '',
              },
              {
                node: {
                  type: 'node',
                  snippet: '<select id="CCExpiresYear">',
                  nodeLabel: 'YY\n2019\n2020\n2021\n2022\n2023\n2024\n2025\n2026\n2027\n2028\n2029',
                },
                suggestion: 'cc-exp-year',
                current: '',
              },
            ],
          },
        },
      },
    },
  },
];

module.exports = expectations;
