/**
 * NFS: Most Wanted (2005) - Base de Datos de Rutas y Circuitos
 * Contiene todas las pistas registradas (Circuitos, Sprints y Drags)
 * vinculadas con sus respectivos Google Sheets CSV.
 */

const routesData = [
    // =======================================================
    // CIRCUITOS (Requieren 4 URLs CSV)
    // =======================================================
    { 
        name: "City Perimeter", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRrC0TBAODyviJ7i2vO-v9lDjbQSJwbrhYid4zM86YIoozEZC7knLtPOPjlYIkcgjHjamgSG7-Lu8Rm/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vRrC0TBAODyviJ7i2vO-v9lDjbQSJwbrhYid4zM86YIoozEZC7knLtPOPjlYIkcgjHjamgSG7-Lu8Rm/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRrC0TBAODyviJ7i2vO-v9lDjbQSJwbrhYid4zM86YIoozEZC7knLtPOPjlYIkcgjHjamgSG7-Lu8Rm/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vRrC0TBAODyviJ7i2vO-v9lDjbQSJwbrhYid4zM86YIoozEZC7knLtPOPjlYIkcgjHjamgSG7-Lu8Rm/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Ironwood States", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYMNQXaAzlB0eoNiiWX5RekaYWGZWXGgYbWsPSj57AhOjmkh9zGXetaIROVrYoys1Djg4j7aCkFyup/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYMNQXaAzlB0eoNiiWX5RekaYWGZWXGgYbWsPSj57AhOjmkh9zGXetaIROVrYoys1Djg4j7aCkFyup/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYMNQXaAzlB0eoNiiWX5RekaYWGZWXGgYbWsPSj57AhOjmkh9zGXetaIROVrYoys1Djg4j7aCkFyup/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vRYMNQXaAzlB0eoNiiWX5RekaYWGZWXGgYbWsPSj57AhOjmkh9zGXetaIROVrYoys1Djg4j7aCkFyup/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Campus Way", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vStZo0IeCdXXjHJfhth7FwjoHaKER81KduHg2OX-rkTfk27g8IMKo8UnrWfGfEhZ4_pz7bvsd7HWtqu/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vStZo0IeCdXXjHJfhth7FwjoHaKER81KduHg2OX-rkTfk27g8IMKo8UnrWfGfEhZ4_pz7bvsd7HWtqu/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vStZo0IeCdXXjHJfhth7FwjoHaKER81KduHg2OX-rkTfk27g8IMKo8UnrWfGfEhZ4_pz7bvsd7HWtqu/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vStZo0IeCdXXjHJfhth7FwjoHaKER81KduHg2OX-rkTfk27g8IMKo8UnrWfGfEhZ4_pz7bvsd7HWtqu/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Highlands", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vThZe-ShdgBop3CgCotuQdozB19ZFXp607ufphufolUEReNz-eG1lZ_wh1HMpj7lG37iPdbMypHeojM/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vThZe-ShdgBop3CgCotuQdozB19ZFXp607ufphufolUEReNz-eG1lZ_wh1HMpj7lG37iPdbMypHeojM/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vThZe-ShdgBop3CgCotuQdozB19ZFXp607ufphufolUEReNz-eG1lZ_wh1HMpj7lG37iPdbMypHeojM/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vThZe-ShdgBop3CgCotuQdozB19ZFXp607ufphufolUEReNz-eG1lZ_wh1HMpj7lG37iPdbMypHeojM/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Petersburgs", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQcjeFik-iTKEyWvkJbjXWlt6ifYSwD2cRe956vT1qte57NAZhxBqdKu4DZaQLy_d8fWegIJsZfb-_T/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vQcjeFik-iTKEyWvkJbjXWlt6ifYSwD2cRe956vT1qte57NAZhxBqdKu4DZaQLy_d8fWegIJsZfb-_T/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQcjeFik-iTKEyWvkJbjXWlt6ifYSwD2cRe956vT1qte57NAZhxBqdKu4DZaQLy_d8fWegIJsZfb-_T/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vQcjeFik-iTKEyWvkJbjXWlt6ifYSwD2cRe956vT1qte57NAZhxBqdKu4DZaQLy_d8fWegIJsZfb-_T/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Heritage Height", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQFzuJMkWX14AhCwjGg9erH4ldCk-12LRLj1ynmSWsUaJ99q21K6MoNT0uJ7Iuf5IvCOc50ASgK8qTC/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vQFzuJMkWX14AhCwjGg9erH4ldCk-12LRLj1ynmSWsUaJ99q21K6MoNT0uJ7Iuf5IvCOc50ASgK8qTC/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQFzuJMkWX14AhCwjGg9erH4ldCk-12LRLj1ynmSWsUaJ99q21K6MoNT0uJ7Iuf5IvCOc50ASgK8qTC/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vQFzuJMkWX14AhCwjGg9erH4ldCk-12LRLj1ynmSWsUaJ99q21K6MoNT0uJ7Iuf5IvCOc50ASgK8qTC/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Omega", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTztSGMlyoEleRpj7iVjcIPw5YhrAR9q7kCsPKjyvrC-WVss9VjAc1Ol137788aMtHSoZ3x42Y2f2UQ/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vTztSGMlyoEleRpj7iVjcIPw5YhrAR9q7kCsPKjyvrC-WVss9VjAc1Ol137788aMtHSoZ3x42Y2f2UQ/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTztSGMlyoEleRpj7iVjcIPw5YhrAR9q7kCsPKjyvrC-WVss9VjAc1Ol137788aMtHSoZ3x42Y2f2UQ/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vTztSGMlyoEleRpj7iVjcIPw5YhrAR9q7kCsPKjyvrC-WVss9VjAc1Ol137788aMtHSoZ3x42Y2f2UQ/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Diamond", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbVXM92XBkk6rNs9WXmV20tvIE4Q6hTCqaSVla7mS8cxt0qcXFZADtJGtpdYBur29OmOEKoCWiluYI/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbVXM92XBkk6rNs9WXmV20tvIE4Q6hTCqaSVla7mS8cxt0qcXFZADtJGtpdYBur29OmOEKoCWiluYI/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbVXM92XBkk6rNs9WXmV20tvIE4Q6hTCqaSVla7mS8cxt0qcXFZADtJGtpdYBur29OmOEKoCWiluYI/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbVXM92XBkk6rNs9WXmV20tvIE4Q6hTCqaSVla7mS8cxt0qcXFZADtJGtpdYBur29OmOEKoCWiluYI/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Hillcrest Boundary", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTTL_N-_AsDPxiluo17ftyPpkniueVgVOs7KUS6SqQpxUBtwSA4oCXpwdqDXE-dHpVe_ekB_-_y_E_L/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vTTL_N-_AsDPxiluo17ftyPpkniueVgVOs7KUS6SqQpxUBtwSA4oCXpwdqDXE-dHpVe_ekB_-_y_E_L/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTTL_N-_AsDPxiluo17ftyPpkniueVgVOs7KUS6SqQpxUBtwSA4oCXpwdqDXE-dHpVe_ekB_-_y_E_L/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vTTL_N-_AsDPxiluo17ftyPpkniueVgVOs7KUS6SqQpxUBtwSA4oCXpwdqDXE-dHpVe_ekB_-_y_E_L/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Circle Rose", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vScO-5zpY2Amb9rF8VdaC5-W7t3it7PUpsOSFNHRm9sAY6oAvtuCnMEWI2xJjKOP8z1bOkB_jdNePC6/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vScO-5zpY2Amb9rF8VdaC5-W7t3it7PUpsOSFNHRm9sAY6oAvtuCnMEWI2xJjKOP8z1bOkB_jdNePC6/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vScO-5zpY2Amb9rF8VdaC5-W7t3it7PUpsOSFNHRm9sAY6oAvtuCnMEWI2xJjKOP8z1bOkB_jdNePC6/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vScO-5zpY2Amb9rF8VdaC5-W7t3it7PUpsOSFNHRm9sAY6oAvtuCnMEWI2xJjKOP8z1bOkB_jdNePC6/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Switchback", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSamV2dwugajyaHKTVIMkDMf1B9fw2L1Hsz-VFCnSb_mJRg1XPQFy7QC_kn4il96Oz54RakPM6klUao/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vSamV2dwugajyaHKTVIMkDMf1B9fw2L1Hsz-VFCnSb_mJRg1XPQFy7QC_kn4il96Oz54RakPM6klUao/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vSamV2dwugajyaHKTVIMkDMf1B9fw2L1Hsz-VFCnSb_mJRg1XPQFy7QC_kn4il96Oz54RakPM6klUao/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vSamV2dwugajyaHKTVIMkDMf1B9fw2L1Hsz-VFCnSb_mJRg1XPQFy7QC_kn4il96Oz54RakPM6klUao/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Hospital Switchback", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdgOybCQcg9N6oKRPpHNEW4qMWtQEXWOtNEzaLmJ7hcU_r1UUdKRQTRdAJ87eVk9L5SZfVxwMojxrR/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdgOybCQcg9N6oKRPpHNEW4qMWtQEXWOtNEzaLmJ7hcU_r1UUdKRQTRdAJ87eVk9L5SZfVxwMojxrR/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdgOybCQcg9N6oKRPpHNEW4qMWtQEXWOtNEzaLmJ7hcU_r1UUdKRQTRdAJ87eVk9L5SZfVxwMojxrR/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdgOybCQcg9N6oKRPpHNEW4qMWtQEXWOtNEzaLmJ7hcU_r1UUdKRQTRdAJ87eVk9L5SZfVxwMojxrR/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Dunwich Bay", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUcIXZt1I-19XmXW86QHntG6tulbvynivFyMGTXxe6UIEGPr9mJtLDASeVdlM3QUd2HtlIrBIBb5tY/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUcIXZt1I-19XmXW86QHntG6tulbvynivFyMGTXxe6UIEGPr9mJtLDASeVdlM3QUd2HtlIrBIBb5tY/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUcIXZt1I-19XmXW86QHntG6tulbvynivFyMGTXxe6UIEGPr9mJtLDASeVdlM3QUd2HtlIrBIBb5tY/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vSUcIXZt1I-19XmXW86QHntG6tulbvynivFyMGTXxe6UIEGPr9mJtLDASeVdlM3QUd2HtlIrBIBb5tY/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Boundary", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8ZOL1_Z7Lcv1_e5OVPn4u5yD_FwcGfYwwNEYNXtGM4jYgnEXwZh_K8nOx6DgAP6Iiy1F6vBxWjCe0/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8ZOL1_Z7Lcv1_e5OVPn4u5yD_FwcGfYwwNEYNXtGM4jYgnEXwZh_K8nOx6DgAP6Iiy1F6vBxWjCe0/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8ZOL1_Z7Lcv1_e5OVPn4u5yD_FwcGfYwwNEYNXtGM4jYgnEXwZh_K8nOx6DgAP6Iiy1F6vBxWjCe0/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8ZOL1_Z7Lcv1_e5OVPn4u5yD_FwcGfYwwNEYNXtGM4jYgnEXwZh_K8nOx6DgAP6Iiy1F6vBxWjCe0/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Century Square", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRiydOeMiVJy4qJsAxhLxByhOw_Lv4l9m1NP4guWZlBdFLcxAx1LKO8TJcZiAVuTDUoFvdCcY04J7MT/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vRiydOeMiVJy4qJsAxhLxByhOw_Lv4l9m1NP4guWZlBdFLcxAx1LKO8TJcZiAVuTDUoFvdCcY04J7MT/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRiydOeMiVJy4qJsAxhLxByhOw_Lv4l9m1NP4guWZlBdFLcxAx1LKO8TJcZiAVuTDUoFvdCcY04J7MT/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vRiydOeMiVJy4qJsAxhLxByhOw_Lv4l9m1NP4guWZlBdFLcxAx1LKO8TJcZiAVuTDUoFvdCcY04J7MT/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Heritage & Omega", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVmUFaxSFBn3amevTa22qFuci_c3I-YSiQQJiYsklS_2yAOUtu2VFIsOJ9X4P3qFxaMBlNxSKa5mDG/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVmUFaxSFBn3amevTa22qFuci_c3I-YSiQQJiYsklS_2yAOUtu2VFIsOJ9X4P3qFxaMBlNxSKa5mDG/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVmUFaxSFBn3amevTa22qFuci_c3I-YSiQQJiYsklS_2yAOUtu2VFIsOJ9X4P3qFxaMBlNxSKa5mDG/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vRVmUFaxSFBn3amevTa22qFuci_c3I-YSiQQJiYsklS_2yAOUtu2VFIsOJ9X4P3qFxaMBlNxSKa5mDG/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Little Italy", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmiklWwG2quphT8kdlFw6rzjH7UK7K5oW-g5vFXiy8hL7wuJyw1C9IENrjL-tJQKOmrAc-43flzGI7/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmiklWwG2quphT8kdlFw6rzjH7UK7K5oW-g5vFXiy8hL7wuJyw1C9IENrjL-tJQKOmrAc-43flzGI7/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmiklWwG2quphT8kdlFw6rzjH7UK7K5oW-g5vFXiy8hL7wuJyw1C9IENrjL-tJQKOmrAc-43flzGI7/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmiklWwG2quphT8kdlFw6rzjH7UK7K5oW-g5vFXiy8hL7wuJyw1C9IENrjL-tJQKOmrAc-43flzGI7/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Ironhorse", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQOkizIL_AytLlQXAbJN07Pu7TASTmt9TtUmuwy7EPO7f2Z6WNeBv2sD1FlAI_4JtQTyI3G15rbuS23/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vQOkizIL_AytLlQXAbJN07Pu7TASTmt9TtUmuwy7EPO7f2Z6WNeBv2sD1FlAI_4JtQTyI3G15rbuS23/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQOkizIL_AytLlQXAbJN07Pu7TASTmt9TtUmuwy7EPO7f2Z6WNeBv2sD1FlAI_4JtQTyI3G15rbuS23/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vQOkizIL_AytLlQXAbJN07Pu7TASTmt9TtUmuwy7EPO7f2Z6WNeBv2sD1FlAI_4JtQTyI3G15rbuS23/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Waterfront", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6xZTZewVghW7HA_qpsvpLdis6RvKhSrIeZtnyWywZlgf8FOW-dxUWLNnXf04bOHQ0eNnQioOBkQcd/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6xZTZewVghW7HA_qpsvpLdis6RvKhSrIeZtnyWywZlgf8FOW-dxUWLNnXf04bOHQ0eNnQioOBkQcd/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6xZTZewVghW7HA_qpsvpLdis6RvKhSrIeZtnyWywZlgf8FOW-dxUWLNnXf04bOHQ0eNnQioOBkQcd/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vT6xZTZewVghW7HA_qpsvpLdis6RvKhSrIeZtnyWywZlgf8FOW-dxUWLNnXf04bOHQ0eNnQioOBkQcd/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Gray Point", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTNVdFs7Q7Kej4n0dCozLLPq6d2uN7pXbppX22Z-8ddkq37RGQLsv2GfeGV7CmUAd6Tt7I-7B_OP5g7/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vTNVdFs7Q7Kej4n0dCozLLPq6d2uN7pXbppX22Z-8ddkq37RGQLsv2GfeGV7CmUAd6Tt7I-7B_OP5g7/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTNVdFs7Q7Kej4n0dCozLLPq6d2uN7pXbppX22Z-8ddkq37RGQLsv2GfeGV7CmUAd6Tt7I-7B_OP5g7/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vTNVdFs7Q7Kej4n0dCozLLPq6d2uN7pXbppX22Z-8ddkq37RGQLsv2GfeGV7CmUAd6Tt7I-7B_OP5g7/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Omega & Industries", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTB7YV0MbbNBKl5wMiCGs8hR0grRsQC2T7K8M4WpE0kZoUUZDRdh8flxiP9KmGfH6ao7fw473xCkPM4/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vTB7YV0MbbNBKl5wMiCGs8hR0grRsQC2T7K8M4WpE0kZoUUZDRdh8flxiP9KmGfH6ao7fw473xCkPM4/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTB7YV0MbbNBKl5wMiCGs8hR0grRsQC2T7K8M4WpE0kZoUUZDRdh8flxiP9KmGfH6ao7fw473xCkPM4/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vTB7YV0MbbNBKl5wMiCGs8hR0grRsQC2T7K8M4WpE0kZoUUZDRdh8flxiP9KmGfH6ao7fw473xCkPM4/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Bay Bridge", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQTb0_qgTgzWFCx2C2tMd5fgvISZfHL74PP1nHEC5OHu2TW_w_I5K2REGxN5CoqzmM9l6RPIhp5j43K/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vQTb0_qgTgzWFCx2C2tMd5fgvISZfHL74PP1nHEC5OHu2TW_w_I5K2REGxN5CoqzmM9l6RPIhp5j43K/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQTb0_qgTgzWFCx2C2tMd5fgvISZfHL74PP1nHEC5OHu2TW_w_I5K2REGxN5CoqzmM9l6RPIhp5j43K/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vQTb0_qgTgzWFCx2C2tMd5fgvISZfHL74PP1nHEC5OHu2TW_w_I5K2REGxN5CoqzmM9l6RPIhp5j43K/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Camden Tunnel", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdxfkyIJVuqgARoOwHBbicYTqcFIIb6gjv4rPAIIgwgqh9-wgSj2RGCot4kRx9Si0CA1Uf8TZnX2lW/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdxfkyIJVuqgARoOwHBbicYTqcFIIb6gjv4rPAIIgwgqh9-wgSj2RGCot4kRx9Si0CA1Uf8TZnX2lW/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdxfkyIJVuqgARoOwHBbicYTqcFIIb6gjv4rPAIIgwgqh9-wgSj2RGCot4kRx9Si0CA1Uf8TZnX2lW/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vQdxfkyIJVuqgARoOwHBbicYTqcFIIb6gjv4rPAIIgwgqh9-wgSj2RGCot4kRx9Si0CA1Uf8TZnX2lW/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Campus Interchange", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQvwf0a_1I8u7B5yL6kVEW3SmNl1FvN29NYEAsrkJl8uf2OHEqYsuFrsti_7b5_tHc8K23SNv-pJTnS/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vQvwf0a_1I8u7B5yL6kVEW3SmNl1FvN29NYEAsrkJl8uf2OHEqYsuFrsti_7b5_tHc8K23SNv-pJTnS/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQvwf0a_1I8u7B5yL6kVEW3SmNl1FvN29NYEAsrkJl8uf2OHEqYsuFrsti_7b5_tHc8K23SNv-pJTnS/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vQvwf0a_1I8u7B5yL6kVEW3SmNl1FvN29NYEAsrkJl8uf2OHEqYsuFrsti_7b5_tHc8K23SNv-pJTnS/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Country Club", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTn0CLEhwX3VYc9Z33GVgUCXnuPxBrn0mZSq8E9vQTEYyKXrc65kB84wrBQaj1K9lua8j0fhi9iFRmq/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vTn0CLEhwX3VYc9Z33GVgUCXnuPxBrn0mZSq8E9vQTEYyKXrc65kB84wrBQaj1K9lua8j0fhi9iFRmq/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTn0CLEhwX3VYc9Z33GVgUCXnuPxBrn0mZSq8E9vQTEYyKXrc65kB84wrBQaj1K9lua8j0fhi9iFRmq/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vTn0CLEhwX3VYc9Z33GVgUCXnuPxBrn0mZSq8E9vQTEYyKXrc65kB84wrBQaj1K9lua8j0fhi9iFRmq/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "East Park", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTHiO__KHIdb-K4WC4fIQOkN0BXJIOizzkw2DlebmR-Q2b25U0sAGpJVhrBrTMupNggITNvcR7Govor/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vTHiO__KHIdb-K4WC4fIQOkN0BXJIOizzkw2DlebmR-Q2b25U0sAGpJVhrBrTMupNggITNvcR7Govor/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTHiO__KHIdb-K4WC4fIQOkN0BXJIOizzkw2DlebmR-Q2b25U0sAGpJVhrBrTMupNggITNvcR7Govor/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vTHiO__KHIdb-K4WC4fIQOkN0BXJIOizzkw2DlebmR-Q2b25U0sAGpJVhrBrTMupNggITNvcR7Govor/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Oil Refinery", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSH_deUce4RWs9XEDTCB79rGj_rxbKmvCOHhD6qWOKePy7OrrwVJHhEI8xsBrbYOrq83dlQVrHMRPUk/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vSH_deUce4RWs9XEDTCB79rGj_rxbKmvCOHhD6qWOKePy7OrrwVJHhEI8xsBrbYOrq83dlQVrHMRPUk/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vSH_deUce4RWs9XEDTCB79rGj_rxbKmvCOHhD6qWOKePy7OrrwVJHhEI8xsBrbYOrq83dlQVrHMRPUk/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vSH_deUce4RWs9XEDTCB79rGj_rxbKmvCOHhD6qWOKePy7OrrwVJHhEI8xsBrbYOrq83dlQVrHMRPUk/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "Hastings", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQOx1L6ilq3tl3qti4r6ex0sbNmHXBPBu2xWYpYJcjQ2j5uuN5xCrR0RAyTobiKj-CWFV7Ae4vTMMRj/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vQOx1L6ilq3tl3qti4r6ex0sbNmHXBPBu2xWYpYJcjQ2j5uuN5xCrR0RAyTobiKj-CWFV7Ae4vTMMRj/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQOx1L6ilq3tl3qti4r6ex0sbNmHXBPBu2xWYpYJcjQ2j5uuN5xCrR0RAyTobiKj-CWFV7Ae4vTMMRj/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vQOx1L6ilq3tl3qti4r6ex0sbNmHXBPBu2xWYpYJcjQ2j5uuN5xCrR0RAyTobiKj-CWFV7Ae4vTMMRj/pub?gid=1342310622&single=true&output=csv"
        }
    },
    { 
        name: "ClubHouse", 
        type: "Circuito", 
        sheets: {
            junkmanSingle: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSFJ2UsnATNZpVPQh_ZzPVEpZuae9pedNy-XsDMnSzIWHmxcip9bsiABtztOefxxezrHn4xeE0wntdg/pub?gid=634347005&single=true&output=csv",
            junkmanFast:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vSFJ2UsnATNZpVPQh_ZzPVEpZuae9pedNy-XsDMnSzIWHmxcip9bsiABtztOefxxezrHn4xeE0wntdg/pub?gid=1989010516&single=true&output=csv",
            bmwSingle:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vSFJ2UsnATNZpVPQh_ZzPVEpZuae9pedNy-XsDMnSzIWHmxcip9bsiABtztOefxxezrHn4xeE0wntdg/pub?gid=509105205&single=true&output=csv",
            bmwFast:       "https://docs.google.com/spreadsheets/d/e/2PACX-1vSFJ2UsnATNZpVPQh_ZzPVEpZuae9pedNy-XsDMnSzIWHmxcip9bsiABtztOefxxezrHn4xeE0wntdg/pub?gid=1342310622&single=true&output=csv"
        }
    },

    // =======================================================
    // SPRINTS (Requieren 2 URLs CSV)
    // =======================================================
    { 
        name: "Seaside & Power Station", 
        alias: "Bayshore & Power Station",
        type: "Sprint", 
        sheets: { 
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTopj2KbigWGa77McjiDle5LG7yBMxeu5ZCmzznXiYJNjQvSAMnl_UeyAzCjQhcO8k-FNi7PlxlabXq/pub?gid=634347005&single=true&output=csv", 
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTopj2KbigWGa77McjiDle5LG7yBMxeu5ZCmzznXiYJNjQvSAMnl_UeyAzCjQhcO8k-FNi7PlxlabXq/pub?gid=1989010516&single=true&output=csv" 
        } 
    },
    { 
        name: "NFS World Loop", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfdxr5CKyrZZ6pwkFHh9vCXbhQ9vWCc8eWByfgF9LiQDVD6ODLrXPfBSkksHvb-93Hm45MJ0pflPsO/pub?gid=634347005&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQfdxr5CKyrZZ6pwkFHh9vCXbhQ9vWCc8eWByfgF9LiQDVD6ODLrXPfBSkksHvb-93Hm45MJ0pflPsO/pub?gid=1989010516&single=true&output=csv"
        } 
    },
    { 
        name: "Diamond & Unión", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-7w6t4lFAn40wwFvNahGe7-PLpQghz79smrie6KtNbBlBgCrnDjAPdKT8dPR9j78s0xpyF4bm2VBU/pub?gid=634347005&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-7w6t4lFAn40wwFvNahGe7-PLpQghz79smrie6KtNbBlBgCrnDjAPdKT8dPR9j78s0xpyF4bm2VBU/pub?gid=1989010516&single=true&output=csv"
        } 
    },
    { 
        name: "Hwy 99 & States", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmab4U3Os10zmaJJl5OrFIiYfhT8dStE4AlUs5jvb8OQm8Md4MQHn10qVmmfchEOAI7vmOhwXMAHKN/pub?gid=634347005&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vSmab4U3Os10zmaJJl5OrFIiYfhT8dStE4AlUs5jvb8OQm8Md4MQHn10qVmmfchEOAI7vmOhwXMAHKN/pub?gid=1989010516&single=true&output=csv"
        } 
    },
    { 
        name: "Clubhouse & Hollis", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS3vNPCuRcDkXOj5YeBS3RfA1iS709_FZeIk-DDM3NGfiElwzRXtYCOrqqdBdSEugVl1eCUSuRksU7t/pub?gid=634347005&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vS3vNPCuRcDkXOj5YeBS3RfA1iS709_FZeIk-DDM3NGfiElwzRXtYCOrqqdBdSEugVl1eCUSuRksU7t/pub?gid=1989010516&single=true&output=csv"
        } 
    },
    { 
        name: "Stadium & Hwy 99", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSKgB_F9woTeuJJImM3nI84FQ_xgsZn4yfllfGBBCKJWJGlNAxw9EYI9zpNHBeKh4sOs9GVxgBDn2OT/pub?gid=634347005&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vSKgB_F9woTeuJJImM3nI84FQ_xgsZn4yfllfGBBCKJWJGlNAxw9EYI9zpNHBeKh4sOs9GVxgBDn2OT/pub?gid=1989010516&single=true&output=csv"
        } 
    },
    { 
        name: "Rosewood & State", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSdMkRJXga4THlU5ZL2rZrB4W0lFej1MM6XpohRm4AYzbh5k3I4CfMVgZ1sE-zdXi6ZmlRSZu5P00kv/pub?gid=634347005&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vSdMkRJXga4THlU5ZL2rZrB4W0lFej1MM6XpohRm4AYzbh5k3I4CfMVgZ1sE-zdXi6ZmlRSZu5P00kv/pub?gid=1989010516&single=true&output=csv"
        } 
    },
    { 
        name: "Rosewood & Lyon", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRjjg8uIi-_nU-uhGGypjEq8pgmMw71w7eaW8uPRaMhPlVYEMRzVwJnHyHiy8CnRxXwcyRt5w7Hk4aY/pub?gid=634347005&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRjjg8uIi-_nU-uhGGypjEq8pgmMw71w7eaW8uPRaMhPlVYEMRzVwJnHyHiy8CnRxXwcyRt5w7Hk4aY/pub?gid=1989010516&single=true&output=csv"
        } 
    },
    { 
        name: "Unión & Hollis", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTTzM3eLgxZlNZyxHY2SvO86tLdFUJUfhzqJl0jauHnk4F0Yf7Dvov3CjDUBVRUmZ3MTtNtb-v8cGBh/pub?gid=634347005&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTTzM3eLgxZlNZyxHY2SvO86tLdFUJUfhzqJl0jauHnk4F0Yf7Dvov3CjDUBVRUmZ3MTtNtb-v8cGBh/pub?gid=1989010516&single=true&output=csv"
        } 
    },
    { 
        name: "Heritage & Campus", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRT4IoP8s15z975Qz2bmDBaRFz-hSS0d4CSB_Ffu3ud8iplMzIR-tN1E1mWOGJLsmM3-W-_SqRlPGiD/pub?gid=634347005&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRT4IoP8s15z975Qz2bmDBaRFz-hSS0d4CSB_Ffu3ud8iplMzIR-tN1E1mWOGJLsmM3-W-_SqRlPGiD/pub?gid=1989010516&single=true&output=csv"
        } 
    },
    { 
        name: "Campus Chancellor", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrZxUlnaUangYt-Y9hoT8fubxyAAsHZvM4MZtpwD5iodBcHY9wjHYi4ssXvcufcg2vf9hsF2T921JA/pub?gid=634347005&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vSrZxUlnaUangYt-Y9hoT8fubxyAAsHZvM4MZtpwD5iodBcHY9wjHYi4ssXvcufcg2vf9hsF2T921JA/pub?gid=1989010516&single=true&output=csv"
        } 
    },
    { 
        name: "Rockridge & Unión", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRuIJqooUvQPpbK5C4dW-iX9uEBWFwIYfMyeUCalPampldLeKbdhOMWMnXV2-8DocKKmJElXcKvqkew/pub?gid=634347005&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRuIJqooUvQPpbK5C4dW-iX9uEBWFwIYfMyeUCalPampldLeKbdhOMWMnXV2-8DocKKmJElXcKvqkew/pub?gid=1989010516&single=true&output=csv"
        } 
    },
    { 
        name: "Chace & Bristol", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9fToV4ttONnde-BiuMzxiJr642ElsFsLrgK0h2cmgHC9-Hoxb-r__80jnqvybbp2LXnmzKsTg5R0L/pub?gid=634347005&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ9fToV4ttONnde-BiuMzxiJr642ElsFsLrgK0h2cmgHC9-Hoxb-r__80jnqvybbp2LXnmzKsTg5R0L/pub?gid=1989010516&single=true&output=csv"
        } 
    },
    { 
        name: "Beacon & Station", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTY_jZflWNXuPT6rw-zGZ6G1DGNbpv8RTftTRJNG0EY3lwlwclhLEd4UicKwFWLRQJSmV2wKbJAUe0N/pub?gid=634347005&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTY_jZflWNXuPT6rw-zGZ6G1DGNbpv8RTftTRJNG0EY3lwlwclhLEd4UicKwFWLRQJSmV2wKbJAUe0N/pub?gid=1989010516&single=true&output=csv"
        } 
    },
    { 
        name: "Bristol & Bayshore", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTVYttk0jOn71SVslGGyYUXR6ZFGyCzqvOAjT43I5sVVFzhzA5-K8zRhDqUv6a2A4e9vkht0CXS0QQW/pub?gid=634347005&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTVYttk0jOn71SVslGGyYUXR6ZFGyCzqvOAjT43I5sVVFzhzA5-K8zRhDqUv6a2A4e9vkht0CXS0QQW/pub?gid=1989010516&single=true&output=csv"
        } 
    },
    { 
        name: "Boundary & Marina", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTMBNQtKHt4bsVz5eRJfe5UFjgGSEgvWumAeLPgJpYitIP0abQGOs4PB1Yc6GfSAKMISi_chfPvgll6/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTMBNQtKHt4bsVz5eRJfe5UFjgGSEgvWumAeLPgJpYitIP0abQGOs4PB1Yc6GfSAKMISi_chfPvgll6/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Stadium & Hwy 1", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRomTKoLfH8usZzO4i5mr5Uqf1hfOh3QlsZ-V9SIbuE7qzkTj8c-76VufvmKKdImmVZZoN6C_XzKf4X/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRomTKoLfH8usZzO4i5mr5Uqf1hfOh3QlsZ-V9SIbuE7qzkTj8c-76VufvmKKdImmVZZoN6C_XzKf4X/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "North Bay & Harbor", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSF5ENjCm9mD4IO7Yol612Cr_DxBnvBk0gt0mcnBUdkzn9pTvM5lpAcVGVc_ON8g9Vi2oD48CRwX6xT/pub?gid=1693233056&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vSF5ENjCm9mD4IO7Yol612Cr_DxBnvBk0gt0mcnBUdkzn9pTvM5lpAcVGVc_ON8g9Vi2oD48CRwX6xT/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Camden & Route 55", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSBdKZ1F1WEv7E9hbfcZSx06ULVgwqn4QmIS658JtM_Dg_IXXVv0CbCpQstRlqu85UopHW7S2yDYyxI/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vSBdKZ1F1WEv7E9hbfcZSx06ULVgwqn4QmIS658JtM_Dg_IXXVv0CbCpQstRlqu85UopHW7S2yDYyxI/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Heritage & Diamond", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1LTi_YRqPnCKPQafQb78ODXxBDKvYWfFMu75pIPm7tltuegaVdtwpcqu63ATeDhoa7la-gl4Fa6KE/pub?gid=698319718&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ1LTi_YRqPnCKPQafQb78ODXxBDKvYWfFMu75pIPm7tltuegaVdtwpcqu63ATeDhoa7la-gl4Fa6KE/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Camden & Ironwood", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTeE-atK5NGNtRZuW41h1ksn2kPqY-3Kj_DdyTWvlBWzBC6aWwPdhKzDY0utyswMs8qkX6WMh7GMkaZ/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTeE-atK5NGNtRZuW41h1ksn2kPqY-3Kj_DdyTWvlBWzBC6aWwPdhKzDY0utyswMs8qkX6WMh7GMkaZ/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Interchange & Bond", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLtLpRvnwjG9hUXCG6f-rNZPuWoeawH01TetYAw9phGk3th1xsw3WLjjhPHO2pyp7JBdtEILjTuoyv/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLtLpRvnwjG9hUXCG6f-rNZPuWoeawH01TetYAw9phGk3th1xsw3WLjjhPHO2pyp7JBdtEILjTuoyv/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Union Row & Ocean", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQuNgZD8hS5MHMn9grKyyuY8QeANcS4TegtCqVVtw85X2yMEdt3k1qZz6P75LpkUdq_ftJMWbL2tyyT/pub?gid=1472971832&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQuNgZD8hS5MHMn9grKyyuY8QeANcS4TegtCqVVtw85X2yMEdt3k1qZz6P75LpkUdq_ftJMWbL2tyyT/pub?gid=1277215795&single=true&output=csv"
        } 
    },
    { 
        name: "Diamond Valley", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS2bNX8phQUqnTC3kOVpnYlUaoyauIeizClK5oZFHisDGBCnK-p-mYig7Va0mBXLqjOhL0NhqvGAq4r/pub?gid=1013775537&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vS2bNX8phQUqnTC3kOVpnYlUaoyauIeizClK5oZFHisDGBCnK-p-mYig7Va0mBXLqjOhL0NhqvGAq4r/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Stadium & Chace", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRqVOcKPzDKQ2Isw6qSgybRlEQBTMwicj85RWJKiX7LB2HJcf86uLf4yIwXAYONir2pM0xfpCHSICkX/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRqVOcKPzDKQ2Isw6qSgybRlEQBTMwicj85RWJKiX7LB2HJcf86uLf4yIwXAYONir2pM0xfpCHSICkX/pub?gid=379289957&single=true"
        } 
    },
    { 
        name: "West Park & Lyon", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRoKJB6LWyHi9G08TkdBF0jmukOduraz7cVcFa4JRjAdH0z-yyNqVt3S1qxc1DW4MT-UrwE_4JaRJ4H/pub?gid=414290640&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRoKJB6LWyHi9G08TkdBF0jmukOduraz7cVcFa4JRjAdH0z-yyNqVt3S1qxc1DW4MT-UrwE_4JaRJ4H/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Hwy 201 & Lyons", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLj73jDhYqY6RfYgpACt8oQjGiL1zpCayPWHg0zX_EpHnq1zBQKDdNMAOoAPKL2Vu94f37eaX0F_Tw/pub?gid=1330397507&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTLj73jDhYqY6RfYgpACt8oQjGiL1zpCayPWHg0zX_EpHnq1zBQKDdNMAOoAPKL2Vu94f37eaX0F_Tw/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Bond & Country Club", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMmlGoq-B7aUbWZ_IRWX8HsvF7xKouCJpKqONrNHWGOUwQP3jEIWyhz_3rEZuv3c-pIqN4bCbEuoXw/pub?gid=488627468&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQMmlGoq-B7aUbWZ_IRWX8HsvF7xKouCJpKqONrNHWGOUwQP3jEIWyhz_3rEZuv3c-pIqN4bCbEuoXw/pub?gid=580911622&single=true&output=csv"
        } 
    },
    { 
        name: "Lyon & States", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTN74tHFhBpewgDkfR7FyGBDinAGxYcQ4_0bqtG60g2S7wRFefyaXp41Dx-fXLuLVPuoZqhpKn2bMYr/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTN74tHFhBpewgDkfR7FyGBDinAGxYcQ4_0bqtG60g2S7wRFefyaXp41Dx-fXLuLVPuoZqhpKn2bMYr/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Camden & Fisher", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSCZd12IWkEegIBPWTOGJcans9wIOBF2CxhaSgRwpwa3CHGJLgD0cYrMZmvj4YfXsnehAeZeJ37gKbk/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vSCZd12IWkEegIBPWTOGJcans9wIOBF2CxhaSgRwpwa3CHGJLgD0cYrMZmvj4YfXsnehAeZeJ37gKbk/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Beach & Chancellor", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwdUTPXf1PL8rpAPAqteQEVSIOwM7iWUdukiHUX2ICPUCZUfkcOX24tWIjGDPr6rW0z-gBQDkPyDui/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwdUTPXf1PL8rpAPAqteQEVSIOwM7iWUdukiHUX2ICPUCZUfkcOX24tWIjGDPr6rW0z-gBQDkPyDui/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "State & Warren", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQZuE2fMB84vA6VEc20DWoCLJeJPzSgYFNssQjGhHT9doMdGwyDSMhrdllYIaOwZggCASqQ3KtJrpV/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTQZuE2fMB84vA6VEc20DWoCLJeJPzSgYFNssQjGhHT9doMdGwyDSMhrdllYIaOwZggCASqQ3KtJrpV/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Valley & State", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1X_5h_Q2vhrjDAaOlwP7dyf2yKRxMyhb6Jsn4uFFMFx_eDVc9geNWQa8_qHF-rf590NO3OjDrPTOU/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1X_5h_Q2vhrjDAaOlwP7dyf2yKRxMyhb6Jsn4uFFMFx_eDVc9geNWQa8_qHF-rf590NO3OjDrPTOU/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Seagate & Camden", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJQvjJSc8A4ha1dZiAVpMumQcJv9IE3U7QnX1r-2_E1_Uu4b07mweNW_Bxit27PiIlfILaEIDan2HI/pub?gid=348729217&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTJQvjJSc8A4ha1dZiAVpMumQcJv9IE3U7QnX1r-2_E1_Uu4b07mweNW_Bxit27PiIlfILaEIDan2HI/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Bond & Forest Green", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7KFKxrmip6wPMkZ9XKlC3d8vvU-xyQxj0_9pfenySxih-3q1V3j4xKwihrbCKHJR0Q_nEVa1z1hAP/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7KFKxrmip6wPMkZ9XKlC3d8vvU-xyQxj0_9pfenySxih-3q1V3j4xKwihrbCKHJR0Q_nEVa1z1hAP/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Hwy 99 & Projects", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDnYVWQpzZI4DrVGr1CzOMbFSzwJhPBE4yLlG-Vce6hmqxsHJULQoAki7gQ_WyECfSM38CKWYQ09Rb/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRDnYVWQpzZI4DrVGr1CzOMbFSzwJhPBE4yLlG-Vce6hmqxsHJULQoAki7gQ_WyECfSM38CKWYQ09Rb/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Seaside & Lennox", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSXo4GfIpapFebo7ELX4VCpurz804MjGe30LUK6siU6RheVsUGhe2kpKRwUcLpocDtwLPoyWtplXOaL/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vSXo4GfIpapFebo7ELX4VCpurz804MjGe30LUK6siU6RheVsUGhe2kpKRwUcLpocDtwLPoyWtplXOaL/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Camden & Dunwich", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmFQAHn6bcBobMj0RZ9JDQqpJQlVCoxt3ebVZp0n0EtlvWy1hyTHnp9Q8ynCGWwzVgAykBUNEVSgB5/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQmFQAHn6bcBobMj0RZ9JDQqpJQlVCoxt3ebVZp0n0EtlvWy1hyTHnp9Q8ynCGWwzVgAykBUNEVSgB5/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Ironhorse & Coast", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS5uhCOX_Yv3Gt1htuSF8eh7lYtusd6B4EZ94382zYix1Vo_rExWqt0JGqNgcT6aqkVY_9bTnY7f3b7/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vS5uhCOX_Yv3Gt1htuSF8eh7lYtusd6B4EZ94382zYix1Vo_rExWqt0JGqNgcT6aqkVY_9bTnY7f3b7/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Seaside & Interchange", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQunHlx2FoUwKKUtLbDtni-mtqmRoghguKH4ecqPbIIhQjzduBiEmxdth4ZHHf9f3RYwTtfMjU5fqha/pub?gid=1967112342&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQunHlx2FoUwKKUtLbDtni-mtqmRoghguKH4ecqPbIIhQjzduBiEmxdth4ZHHf9f3RYwTtfMjU5fqha/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Hwy 2001", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgOa0hnqMu07kN9Is80IoNFWq0xB_r19Cb-K3HUC9Sc4-m8DJdPSdJDYzPvOetOxr9pmpquJmOoG75/pub?gid=634347005&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQgOa0hnqMu07kN9Is80IoNFWq0xB_r19Cb-K3HUC9Sc4-m8DJdPSdJDYzPvOetOxr9pmpquJmOoG75/pub?gid=1989010516&single=true&output=csv"
        } 
    },
    { 
        name: "Diamond Park", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRW5xr_3lafqvycsRJYq1HvgQAxLb9J029a_F_LcTcMWdSqB3To2mKFAiTZcA6OOcs3V5pgKhCxw01m/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRW5xr_3lafqvycsRJYq1HvgQAxLb9J029a_F_LcTcMWdSqB3To2mKFAiTZcA6OOcs3V5pgKhCxw01m/pub?gid=1002058181&single=true&output=csv"
        } 
    },
    { 
        name: "Industrial & Bristol", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTvIA-6BbH4FcpPHW5Lnr_wL9PtFajjoMlPVO8Q3njehBbzPF6D4UURCA3hDX8uGKjdyjoMs6eLD29m/pub?gid=1699752903&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTvIA-6BbH4FcpPHW5Lnr_wL9PtFajjoMlPVO8Q3njehBbzPF6D4UURCA3hDX8uGKjdyjoMs6eLD29m/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Bay Bridge & Seaside", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSoq-V_Il6ka-RJziAsdrBBgk3Bw_7ldc0EOJxhyBPBcfezt9sWIxPUDFGspWqO53NATSabbgjGOFIZ/pub?gid=1728776957&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vSoq-V_Il6ka-RJziAsdrBBgk3Bw_7ldc0EOJxhyBPBcfezt9sWIxPUDFGspWqO53NATSabbgjGOFIZ/pub?gid=379289957&single=true&output=csv"
        } 
    },
    { 
        name: "Forest Green", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSMsHALkLCLTuDhj6TyCPLCubXXs6DDv5Nt0xhWcdD8NrVb6unAiBrDdFlXerBmD_NKXhHuuACz37gC/pub?gid=708473327&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vSMsHALkLCLTuDhj6TyCPLCubXXs6DDv5Nt0xhWcdD8NrVb6unAiBrDdFlXerBmD_NKXhHuuACz37gC/pub?gid=100752077&single=true&output=csv"
        } 
    },
    { 
        name: "Clubhouse & Lennox", 
        type: "Sprint", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTdJVEtpVkzM_CtiTM2JeUuYxo7re2mCrbkk4kp1D6m6NcrMXH-7u0niSi3buh508IASUnYF__3zVd6/pub?gid=829369660&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTdJVEtpVkzM_CtiTM2JeUuYxo7re2mCrbkk4kp1D6m6NcrMXH-7u0niSi3buh508IASUnYF__3zVd6/pub?gid=379289957&single=true&output=csv"
        } 
    },

    // =======================================================
    // DRAGS (Requieren 2 URLs CSV)
    // =======================================================
    { 
        name: "Bayshore & Boardwalk", 
        type: "Drag", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQm-MmbU5KZ9mAJGHKBqZU4OLYijwtAIoufgrPZMThO16zJpkJHq8WdJTQ_5FmEwGEL7Sp6hR3nEXcw/pub?gid=891834841&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQm-MmbU5KZ9mAJGHKBqZU4OLYijwtAIoufgrPZMThO16zJpkJHq8WdJTQ_5FmEwGEL7Sp6hR3nEXcw/pub?gid=873743997&single=true&output=csv"
        } 
    },
    { 
        name: "Heritage & Rosewood", 
        type: "Drag", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/1gvJwDubSBBoCJlGBCZV0m8F-4UbYUsd7uyFU2jGUu78/export?format=csv&gid=0",
            bmw:     "https://docs.google.com/spreadsheets/d/1gvJwDubSBBoCJlGBCZV0m8F-4UbYUsd7uyFU2jGUu78/export?format=csv&gid=2049887754"
        } 
    },
    { 
        name: "Harbor & Ocean", 
        type: "Drag", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS2n7Aj8F9UytzUs7qaTlbsDWbfdFXv15f6UFEip896fOZXOLDPaixf9wh3Xb7TI0enKGpQju5fCji8/pub?gid=891834841&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vS2n7Aj8F9UytzUs7qaTlbsDWbfdFXv15f6UFEip896fOZXOLDPaixf9wh3Xb7TI0enKGpQju5fCji8/pub?gid=873743997&single=true&output=csv"
        } 
    },
    { 
        name: "Seaside & Camden", 
        type: "Drag", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQW-_RqC_NA8rQ1GcCT1x1KHKGr0DAwt8TxyqSG1ZFLfx7UN8OJHfOUqrUbanuca9mec9nxUS8YwPfn/pub?gid=891834841&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQW-_RqC_NA8rQ1GcCT1x1KHKGr0DAwt8TxyqSG1ZFLfx7UN8OJHfOUqrUbanuca9mec9nxUS8YwPfn/pub?gid=873743997&single=true&output=csv"
        } 
    },
    { 
        name: "Union & Rockridge", 
        type: "Drag", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1kwWs_tXKwbqPAsPW_fAiCDvUIne1bXHQ-xRKw_kgKrxI-X3gTVImOo2Evj8GU48XCHxsE5_yn-db/pub?gid=891834841&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vT1kwWs_tXKwbqPAsPW_fAiCDvUIne1bXHQ-xRKw_kgKrxI-X3gTVImOo2Evj8GU48XCHxsE5_yn-db/pub?gid=873743997&single=true&output=csv"
        } 
    },
    { 
        name: "Ocean & Harbor", 
        type: "Drag", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSU-8yAEhtX4xcMQL07dIYaTrvl4nKA4Kro--prrNsyKMgtREZS6_Y83papzgyO23zixoobOCHchKAu/pub?gid=891834841&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vSU-8yAEhtX4xcMQL07dIYaTrvl4nKA4Kro--prrNsyKMgtREZS6_Y83papzgyO23zixoobOCHchKAu/pub?gid=873743997&single=true&output=csv"
        } 
    },
    { 
        name: "Riverside & Terrace", 
        type: "Drag", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8xTTFuTsYrSct5FvXJUrVF8VKZS0P46r90r2-NUvUrHGYD13bkUIXdUY1h-wSrWKrbK22yF9kdjw9/pub?gid=891834841&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8xTTFuTsYrSct5FvXJUrVF8VKZS0P46r90r2-NUvUrHGYD13bkUIXdUY1h-wSrWKrbK22yF9kdjw9/pub?gid=873743997&single=true&output=csv"
        } 
    },
    { 
        name: "Rosewood & Heritage", 
        type: "Drag", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRjconIzcyJjslncxHElAT23p4Cq8t5a5NIvg2-gtaB56hGuw8nxxWsxVeJgidGh0Ywdyg20E0gpaoj/pub?gid=891834841&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRjconIzcyJjslncxHElAT23p4Cq8t5a5NIvg2-gtaB56hGuw8nxxWsxVeJgidGh0Ywdyg20E0gpaoj/pub?gid=873743997&single=true&output=csv"
        } 
    },
    { 
        name: "Boardwalk & Bayshore", 
        type: "Drag", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5FSCOEfd44aR5NPdrItd8Wz0e-LLMt50YFCvSSJql0fR0RGlndT29IwbE6kXysLGkbXrS74GzXHIf/pub?gid=891834841&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vR5FSCOEfd44aR5NPdrItd8Wz0e-LLMt50YFCvSSJql0fR0RGlndT29IwbE6kXysLGkbXrS74GzXHIf/pub?gid=873743997&single=true&output=csv"
        } 
    },
    { 
        name: "Camden & Seaside", 
        type: "Drag", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRlP4XSJ11c076eZwdD9vNiowbxplAiTonrKdj98hSGTf1YtVloXZdpfMPbwOZnB3g1Y-EvGp4BSgBR/pub?gid=891834841&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vRlP4XSJ11c076eZwdD9vNiowbxplAiTonrKdj98hSGTf1YtVloXZdpfMPbwOZnB3g1Y-EvGp4BSgBR/pub?gid=873743997&single=true&output=csv"
        } 
    },
    { 
        name: "Terrace & Riverside", 
        type: "Drag", 
        sheets: {
            junkman: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTz-I9vKew9eXaTwc3Ib8HumuNYVg9Suc_IzoswPxJI4q4xkjMftkV1-wx5ZWa8oRFkkZqf6hBPS0-D/pub?gid=891834841&single=true&output=csv",
            bmw:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vTz-I9vKew9eXaTwc3Ib8HumuNYVg9Suc_IzoswPxJI4q4xkjMftkV1-wx5ZWa8oRFkkZqf6hBPS0-D/pub?gid=873743997&single=true&output=csv"
        } 
    }
];
