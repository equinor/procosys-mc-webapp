import React from 'react';
import Navbar from '../../components/navigation/Navbar';
import Checklist from 'procosys-mc-checklist-module';

const ChecklistWrapper = (): JSX.Element => {
    return (
        <>
            <Navbar />
            <Checklist
                checklistId="24580832"
                plantId="NGPCS_TEST_BROWN"
                baseUrl="https://procosyswebapiqp.equinor.com/"
                accessToken="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiI0NzY0MWM0MC0wMTM1LTQ1OWItOGFiNC00NTllNjhkYzhkMDgiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8zYWE0YTIzNS1iNmUyLTQ4ZDUtOTE5NS03ZmNmMDViNDU5YjAvIiwiaWF0IjoxNjE5NDI3MTg5LCJuYmYiOjE2MTk0MjcxODksImV4cCI6MTYxOTQzMTA4OSwiYWNyIjoiMSIsImFpbyI6IkFVUUF1LzhUQUFBQVRuYmZOcVlkYmRDckpyVVhnV05DSWJLWGYyS0tMd3lsQXpNRmJwak9PYnREekFnbzZyU3VSMHlTd0lHL1hsQTVDREpNYUtzWlEyWUlYWGVLclRCOXBnPT0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiMTBiYmU1MWYtMmEyZC00OTVlLTk0MWMtNTcwMjRlODQ5OTNjIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJMeWdyZSIsImdpdmVuX25hbWUiOiJFcmxlbmQgVGFuZ2VyYWFzIiwiaXBhZGRyIjoiODQuMjA4LjIwNi4zOCIsIm5hbWUiOiJFcmxlbmQgVGFuZ2VyYWFzIEx5Z3JlIiwib2lkIjoiODc3NjYzMDEtNThmZC00ZTJkLTkwZTMtNmRkZmU3MjEwMmJhIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTIyMDUyMzM4OC0xMDg1MDMxMjE0LTcyNTM0NTU0My0yNTY4ODIyIiwicmgiOiIwLkFRSUFOYUtrT3VLMjFVaVJsWF9QQmJSWnNCX2x1eEF0S2w1SmxCeFhBazZFbVR3Q0FJcy4iLCJzY3AiOiJ3ZWJfYXBpIiwic3ViIjoiNEJVYjJUZjk4azU2ZzVUdWFwMlp3XzZVSGp5VU9kdUE4Q083VW9sajBsOCIsInRpZCI6IjNhYTRhMjM1LWI2ZTItNDhkNS05MTk1LTdmY2YwNWI0NTliMCIsInVuaXF1ZV9uYW1lIjoiRVJMWUBlcXVpbm9yLmNvbSIsInVwbiI6IkVSTFlAZXF1aW5vci5jb20iLCJ1dGkiOiIzckZDak5wYjcwNjRoTXZjWTdDSkFBIiwidmVyIjoiMS4wIn0.PWX5ACoGi3hkjQr8mfyIfCJDGf4EZdp5VW42AJHRhX5cYy-p78fe4kE_CloFqrjVPSvblwvws5_eXOtKTu9N17m66yjj0g5iXfLzYmGWcdi37ZoLf2b06AYB6DO_NSkQf3dfUA3_tgl09fLtdPkmlfEQT8EJkFcUk6lnFAyljJO27-Cbj5hIVdPFoTYgO6KFObcijLlaOFMOGQyET_gRE6cs-j3jmB77gulAvVTzsLysKyHGF00oYsS9s5GPikjPPNlEq_FhRi1pfaEqqS1YIpqYzHl6Unlf2DOuOV2t3Br58YFUqPIXhWoyRYU2fPTVHCjDln9OTTWaeQ1SbemqfQ"
            />
        </>
    );
};

export default ChecklistWrapper;
