#include <Arduino.h>
void setup(){
    RCC -> CTLR |= RCC_PLLON; // PLL on
    while((RCC -> CTLR & RCC_PLLRDY) == 0); // wait for pll init
    RCC -> CFGR0 |= RCC_SYSCLKSource_PLLCLK; // SYSCLK = 48MHz 
    RCC -> APB2PCENR |= RCC_APB2Periph_GPIOD;
    RCC -> APB2PCENR |= RCC_APB2Periph_USART1;

    GPIOD -> CFGLR = 0x44444443; // PD0 uart tx, PD1 uart rx, RM=10
    // BAUD = HCLK / (16 * USARTDIV), wirh HCLK = SYSCLK, no pre
    // USARTDIV = mantissa + (fraction / 16)
    // USARTDIV = 48MHz / (16 * 115200) = 26.0416667
    // div_m = 26, div_f = 0.0416667 * 16 = 0.666667 -> round to 1
    AFIO -> PCFR1 |= AFIO_PCFR1_USART1_REMAP;
    USART1 -> BRR = 0x000001A1;
    USART1 -> CTLR1 |= USART_CTLR1_UE;
    USART1 -> CTLR1 |= USART_CTLR1_TE;
    USART1 -> CTLR1 |= USART_CTLR1_RE;
    // 0100 0x4 is highz input
    // 0011 0x3 is push pull 30MHz out

}

void loop(){
    USART1 -> DATAR = 'A';
    delay(1000);
    USART1 -> DATAR = 'B';
    delay(1000);
}