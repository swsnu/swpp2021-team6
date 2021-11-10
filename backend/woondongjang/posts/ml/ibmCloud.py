import json
from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson.natural_language_understanding_v1 import Features, KeywordsOptions

def keyword_extraction_ML(text):
    authenticator = IAMAuthenticator('RUfaiN4C2iFxOwHspcFekE022wkEzoW7EnSgSb2KtRgO')
    natural_language_understanding = NaturalLanguageUnderstandingV1(
        version='2021-08-01',
        authenticator=authenticator
    )

    natural_language_understanding.set_service_url('https://api.kr-seo.natural-language-understanding.watson.cloud.ibm.com/instances/572ce3ab-5aa8-4de7-bec4-db85f624d062')

    response = natural_language_understanding.analyze(
        text = text,
        features=Features(keywords=KeywordsOptions(sentiment=True,emotion=True,limit=3))
    ).get_result()

    results = json.dumps(response, indent=2, ensure_ascii=False)
    json_data = json.loads(results)
    return([each["text"] for each in json_data["keywords"]])