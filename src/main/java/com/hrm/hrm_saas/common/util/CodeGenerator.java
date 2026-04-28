package com.hrm.hrm_saas.common.util;

import java.util.Random;

public class CodeGenerator {

    public static String generateCompanyCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        Random random = new Random();

        StringBuilder code = new StringBuilder();
        for (int i = 0; i < 3; i++) {
            code.append(chars.charAt(random.nextInt(chars.length())));
        }

        int number = 100 + random.nextInt(900);

        return code.toString() + number;
    }
}