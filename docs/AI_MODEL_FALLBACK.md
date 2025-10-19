# AI Model Fallback System

## Overview

The AI chat feature now includes an intelligent model fallback system that automatically switches between different Groq AI models when rate limits are encountered. This maximizes quota utilization across all available models and ensures high availability.

## How It Works

### Fallback Chain

When a chat request is made, the system tries models in this order:

1. **llama-3.3-70b-versatile** (Primary)
   - Best quality responses
   - Limits: 30 RPM, 1K RPD, 12K TPM, 100K TPD
   - Use case: Normal operation

2. **meta-llama/llama-4-scout-17b-16e-instruct**
   - High token capacity (30K TPM)
   - Limits: 30 RPM, 1K RPD, 30K TPM, 500K TPD
   - Use case: Long conversations or detailed responses

3. **llama-3.1-8b-instant**
   - Very high request capacity (14.4K RPD)
   - Limits: 30 RPM, 14.4K RPD, 6K TPM, 500K TPD
   - Use case: High traffic scenarios

4. **qwen/qwen3-32b**
   - Higher requests per minute (60 RPM)
   - Limits: 60 RPM, 1K RPD, 6K TPM, 500K TPD
   - Use case: Burst traffic handling

5. **moonshotai/kimi-k2-instruct** (Final fallback)
   - Alternative high-quality model
   - Limits: 60 RPM, 1K RPD, 10K TPM, 300K TPD
   - Use case: Last resort when all others are exhausted

### Rate Limit Detection

The system automatically detects rate limit errors by checking for:
- "rate limit" in error message
- HTTP 429 status codes
- "quota" or "too many requests" messages

When a rate limit is detected, the system immediately tries the next model in the chain.

### Logging

All fallback attempts are logged to the console:

```
[AI] Attempting with model 1/5: llama-3.3-70b-versatile (Best quality, lower limits)
[AI] ✗ Rate limit hit for llama-3.3-70b-versatile, trying next model...
[AI] Attempting with model 2/5: meta-llama/llama-4-scout-17b-16e-instruct (High TPM fallback)
[AI] ✓ Success with model: meta-llama/llama-4-scout-17b-16e-instruct (fallback #1)
```

## Response Format

The API now returns additional metadata:

```typescript
{
  content: string;           // The AI response text
  modelUsed: string;         // Which model was used (e.g., "llama-3.3-70b-versatile")
  fallbackLevel: number;     // 0 = primary model, 1+ = fallback used
}
```

## Benefits

### 1. **Maximum Quota Utilization**
Instead of only using one model's quota, the system distributes load across 5 different models, effectively multiplying available capacity.

### 2. **High Availability**
Even if the primary model is rate-limited, users still get responses from alternative models without manual intervention.

### 3. **Transparent Operation**
Users don't notice the fallback happening - they just get their response. The system handles all complexity internally.

### 4. **Quality Preservation**
Models are ordered by quality, so the best model is always tried first. Fallbacks maintain good response quality.

### 5. **Cost Efficiency**
All models in the chain are free-tier Groq models, so there's no additional cost for the fallback system.

## Rate Limit Reference

| Model | RPM | RPD | TPM | TPD |
|-------|-----|-----|-----|-----|
| llama-3.3-70b-versatile | 30 | 1K | 12K | 100K |
| llama-4-scout-17b-16e | 30 | 1K | 30K | 500K |
| llama-3.1-8b-instant | 30 | 14.4K | 6K | 500K |
| qwen/qwen3-32b | 60 | 1K | 6K | 500K |
| kimi-k2-instruct | 60 | 1K | 10K | 300K |

**Legend:**
- **RPM**: Requests Per Minute
- **RPD**: Requests Per Day
- **TPM**: Tokens Per Minute (thousands)
- **TPD**: Tokens Per Day (thousands)

## Monitoring

To monitor which models are being used:

1. Check server console logs for `[AI]` prefixed messages
2. The `fallbackLevel` in the response indicates:
   - `0`: Primary model used successfully
   - `1-4`: Fallback model used (higher = more models exhausted)

## Future Enhancements

Potential improvements:
- Track usage statistics per model
- Smart model selection based on request size
- Circuit breaker pattern for temporarily failed models
- Client-side retry with exponential backoff
- Real-time quota monitoring dashboard
