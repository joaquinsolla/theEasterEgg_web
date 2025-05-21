package com.theeasteregg.model.common.exceptions;

@SuppressWarnings("serial")
public class DuplicateUserNameException extends InstanceException {

    public DuplicateUserNameException(String name, Object key) {
        super(name, key);
    }
}
